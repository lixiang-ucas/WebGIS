// function addStation(){

// 	var attributes = { station_id:'1111',station_na:'nana'};
// 	var point = new OpenLayers.Geometry.Point(118, 40);	//几何数据
// 	// Feature对象
// 	var feature = new OpenLayers.Feature.Vector(point,attributes,null);
// 	// 添加到Vector Layer上
// 	g_poi_layer.addFeatures(feature);
// 	// 设置feature的状态为OpenLayers.State.INSERT
// 	feature.state = OpenLayers.State.INSERT;
// 	//  提交Insert操作到服务器
// 	saveStrategy.save();
// }

function updateStation(){
	if(selectedFeature!=null&&selectedFeature.fid!=null){
		lng=$("#edit_station_lng").val();
		lat=$("#edit_station_lng").val();
		var selFeat = g_station_layer.selectedFeatures[0];
		selFeat.attributes.station_na = $("#edit_station_name").val();
		selFeat.attributes.station_id = $("#edit_station_id").val();
		selFeat.Geometry=new OpenLayers.Geometry.Point(lng,lat);
		selFeat.state = OpenLayers.State.UPDATE;
		//  提交Insert操作到服务器
		saveStrategy.save();
		g_station_layer.redraw();
		
	}else{
		alert('没有选择要素');
	}
		
}

function updatePOI(){
	if(selectedFeature!=null&&selectedFeature.fid!=null){
		lng=$("#edit_poi_lng").val();
		lat=$("#edit_poi_lng").val();
		var selFeat = g_station_layer.selectedFeatures[0];
		selFeat.attributes.name = $("#edit_station_name").val();
		selFeat.attributes.address = $("#edit_station_adr").val();
		selFeat.attributes.tag = $("#edit_station_tag").val();
		selFeat.Geometry=new OpenLayers.Geometry.Point(lng,lat);
		selFeat.state = OpenLayers.State.UPDATE;
		//  提交Insert操作到服务器
		saveStrategy.save();
		g_poi_layer.redraw();
		
	}else{
		alert('没有选择要素');
	}
}


function addPOI(){
	var name=$("#add_poi_name").val();
	var address=$("#add_poi_adr").val();
	var tag=$("#add_poi_tag").val();
	var lng=$("#add_poi_lng").val();
	var lat=$("#add_poi_lat").val();
	var url = "http://localhost:8080/geoserver/lixiang/ows";
	var params = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" "
	 + "xmlns:wfs=\"http://www.opengis.net/wfs\" "
	 + "xmlns:lixiang=\"http://www.opengis.net/lixiang\" "
	 + "xmlns:gml=\"http://www.opengis.net/gml\" "
	 + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
	 + "xsi:schemaLocation=\"http://www.opengis.net/wfs "
	 + 	" http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd "
	 + 	" http://www.opengis.net/lixiang\"> "
	 + "<wfs:Insert>"
	 +   "<lixiang:poi_beijing>"
	 +     "<lixiang:name>" + name + "</lixiang:name>"
	 +     "<lixiang:address>" + address + "</lixiang:address>"
	 +     "<lixiang:tag>" + tag + "</lixiang:tag>"
	 +     "<lixiang:the_geom>"
	 +        "<gml:Point>"
	 +			"<gml:coordinates>"+lng+","+lat+"</gml:coordinates>"
	 +	      "</gml:Point>"
	 +     "</lixiang:the_geom>"
	 +   "</lixiang:poi_beijing>"
	 + "</wfs:Insert>"
	 + "</wfs:Transaction>";

	$.ajax({
		type  :"post",
		url   : url,
		contentType: "text/xml",
		data  :params,
		dataType: "text",
        //crossDomain: true,  
		async : false,
		beforeSend: function(XMLHttpRequest){
			console.log("beforeSend-->"+params);
		},
		success : function(xml, textStatus){
			console.log("afterSend-->"+xml);
			alert("插入成功")	
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error : function(){
		}
	});

}

function addStation(){
	var name=$("#add_station_name").val();
	var id=$("#add_station_id").val();
	var lng=$("#add_station_lng").val();
	var lat=$("#add_station_lat").val();
	var url = "http://localhost:8080/geoserver/lixiang/ows";
	var params = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" "
	 + "xmlns:wfs=\"http://www.opengis.net/wfs\" "
	 + "xmlns:lixiang=\"http://www.opengis.net/lixiang\" "
	 + "xmlns:gml=\"http://www.opengis.net/gml\" "
	 + "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
	 + "xsi:schemaLocation=\"http://www.opengis.net/wfs "
	 + 	" http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd "
	 + 	" http://www.opengis.net/lixiang\"> "
	 + "<wfs:Insert>"
	 +   "<lixiang:station_location>"
	 +     "<lixiang:station_na>" + name + "</lixiang:station_na>"
	 +     "<lixiang:station_id>" + id + "</lixiang:station_id>"
	 +     "<lixiang:the_geom>"
	 +        "<gml:Point>"
	 +			"<gml:coordinates>"+lng+","+lat+"</gml:coordinates>"
	 +	      "</gml:Point>"
	 +     "</lixiang:the_geom>"
	 +   "</lixiang:station_location>"
	 + "</wfs:Insert>"
	 + "</wfs:Transaction>";

	$.ajax({
		type  :"post",
		url   : url,
		contentType: "text/xml",
		data  :params,
		dataType: "text",
        //crossDomain: true,  
		async : false,
		beforeSend: function(XMLHttpRequest){
			console.log("beforeSend-->"+params);
		},
		success : function(xml, textStatus){
			console.log("afterSend-->"+xml);
			alert("插入成功")	
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error : function(){
		}
	});

}


function delStation() {
	var selFeat = g_station_layer.selectedFeatures[0];
	var fid=selFeat.fid;
	var params = "<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " 
	+ "xmlns:wfs=\"http://www.opengis.net/wfs\" " 
	+ "xmlns:lixiang=\"http://www.opengis.net/lixiang\" " 
	+ "xmlns:gml=\"http://www.opengis.net/gml\" " 
	+ "xmlns:ogc=\"http://www.opengis.net/ogc\" " 
	+ "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " 
	+ "xsi:schemaLocation=\"http://www.opengis.net/wfs " 
	+ "http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd " 
	+ "http://www.beijingpoi.cn/\">" 
	+ "<wfs:Delete typeName=\"lixiang:station_location\">" 
		+ "<ogc:Filter>" 
			+ "<ogc:FeatureId fid=" + "'" + fid + "'" + "/>" 
		+ "</ogc:Filter>" 
	+ "</wfs:Delete>" 
	+ "</wfs:Transaction>"
	var url = "http://localhost:8080/geoserver/lixiang/ows"
	$.ajax({
		type: "post",
		url: url,
		data: params,
		dataType: "text",
		contentType: "text/xml",
		async: true,
		beforeSend: function(XMLHttpRequest) {},
		success: function(xml, textStatus) {
			alert("删除成功");
		},
		complete: function(XMLHttpRequest, textStatus) {},
		error: function() {
			processError();
		}
	});
}


/*function addPOI(lng,lat){
	var data=new Object();
	data={lng:lng,lat:lat,name:'',address:'',tag:''};
	Ext.onReady(function(){
		// Define our data model
		Ext.define('poi', {
			extend: 'Ext.data.Model',
			fields: [ 'lng', 'lat', 'name', 'address' ,'tag']
		});

		var store = Ext.create('Ext.data.Store', {

			model: 'poi',
			proxy: {
				type: 'memory'
			},
			data: data,
			sorters: [{
				property: 'start',
				direction: 'DESC'
			}]
		});
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			pluginId: 'rowEditing',
			saveBtnText: '保存',
			cancelBtnText: "取消",
			autoCancel: false,
			clicksToEdit: 2, //双击进行修改  1-单击   2-双击    0-可取消双击/单击事件
			// listeners: {
			// 	edit: function(e) {
			// 		var myMask = new Ext.LoadMask(Ext.getBody(), {
			// 			msg: '正在修改，请稍后...',
			// 			removeMask: true //完成后移除
			// 		});
			// 		myMask.show();
			// 		var id = e.record.get('Item');
			// 		// 更新提示界面(供调试使用)
			// 		Ext.Msg.alert('您成功修改信息', "被修改的内容是:" + e.record.get("Item") + "\n 修改的字段是:" + e.field + "\n 对应的id为" + id); //取得更新内容
			// 		Ext.Ajax.request({
			// 			url: '/ashx/erp/purchase/PO_Form_BodySub_Upd.ashx',
			// 			params: {
			// 				PONum: e.record.get('PONum'),
			// 				Item: e.record.get('Item'),
			// 				PurQty: e.record.get('PurQty'),
			// 				DeliveryDate: e.record.get('DeliveryDate')
			// 			},
			// 			success: function(response) {
			// 				var result = Ext.decode(response.responseText);
			// 				if (result.succeed) {
			// 					e.record.commit();
			// 					//隐藏
			// 					myMask.hide();
			// 					Ext.Msg.show({
			// 						title: '操作提示',
			// 						msg: result.msg,
			// 						buttons: Ext.Msg.YES,
			// 						icon: Ext.Msg.WARNING
			// 					});
			// 				} else {
			// 					myMask.hide();
			// 					Ext.Msg.show({
			// 						title: '操作提示',
			// 						msg: result.msg,
			// 						buttons: Ext.Msg.YES,
			// 						icon: Ext.Msg.WARNING
			// 					});
			// 				}
			// 			},
			// 			failure: function(response, opts) {
			// 				Ext.Msg.show({
			// 					title: '操作提示',
			// 					msg: '修改失败',
			// 					buttons: Ext.Msg.YES,
			// 					icon: Ext.Msg.WARNING
			// 				});
			// 			}
			// 		})
			// 	}
			// }
		});

		var grid =Ext.create('Ext.grid.Panel', {
			//renderTo: result_list_div,
			store: store,
			width: 540,
			height: 300,
			title: '结果列表',
			loadMask: true,
			selModel: {
				pruneRemoved: false
			},
			viewConfig: {
				trackOver: false
			},

			columns: [
				{
					xtype: 'rownumberer',
					width: 40,
					sortable: false
				}, 
				{
					text: 'lng',
					width: 100,
					dataIndex: 'lng',
					editor: {
						allowBlank: false,
						xtype: 'numberfield',
						allowBlank: false,
						minValue: -180,
						maxValue: 180,
					}
				},
				{
					text: 'lat',
					width: 100,
					dataIndex: 'lat',
					editor:{
						allowBlank: false,
					xtype: 'numberfield',
					allowBlank: false,
					minValue: -180,
					maxValue: 180,
					}
					
				},
				{
					text: 'name',
					width: 100,
					dataIndex: 'name',
					editor:{
						allowBlank: false,
					}
					
				},
				{
					text: 'address',
					width: 100,
					dataIndex: 'address',
					editor:{
						allowBlank: false,
					}
				},
				{
					text: 'tag',
					width: 100,
					dataIndex: 'tag',
					editor:{
						allowBlank: false,
					}
				}
			],
			plugins: [rowEditing],
			tbar: [{
				text: '提交',
				iconCls: 'employee-add',
				handler : function() {
					var sm = grid.getSelectionModel();
					rowEditing.cancelEdit();
					console.log(sm.getSelection());
					alert('添加POI')
				}
			}],
		});
		new Ext.window.Window({
			width: 540,
			height: 400,
			title: 'POI搜索结果',
			items: grid,
			layout: 'fit',
			closable: true
		}).show();

	});
}*/
/*//This function will be invoked when I click on save image in web map application 
function saveFeature() {
	var wfs=g_poi_layer;
	for (var ss = 0; ss < wfs.selectedFeatures.length; ss++) {
		var selFeat = wfs.selectedFeatures[ss];

		selFeat.attributes.FeatureName = 'Test';
		selFeat.state = OpenLayers.State.UPDATE;
	}

	saveStrategy.save();
}
*/

/*function delFeature() {
	var wfs=g_poi_layer;
	if (wfs.selectedFeatures.length > 0) {
		for (var dd = 0; dd < wfs.selectedFeatures.length; dd++) {
			var selFeat = wfs.selectedFeatures[dd];
			if (selFeat.fid == undefined) {
				this.wfs.destroyFeatures([selFeat]);
			} 
			else {
				selFeat.state = OpenLayers.State.DELETE;
				this.wfs.events.triggerEvent("afterfeaturemodified", {
					feature: selFeat
				});
				selFeat.renderIntent = "select";
				this.wfs.drawFeature(selFeat);
			}
		}
	}
}
*/
