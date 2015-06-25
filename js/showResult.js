function showResults(xml){
	showList(xml);
	showLeft(xml);
	showMakerMap(xml);
}

function showLeft(xml){

	$("#result_list_div").innerHTML = "";
	//document.getElementById("search_result_div").innerHTML = "";

	var html = "";

	$(xml).find("poi_beijing").each(function() {
		var name = $(this).find("name").text();
		var adrs = $(this).find("address").text();
		html += "<div class='result_container'>";
		html += "	<ul>";
		html += "		<li><div class='result_logo'></div></li>";
		html += "		<li><div class='result_div'>" + name + "<br>" + adrs + "</div></li>";
		html += "	</ul>";
		html += "</div>";
	});
	document.getElementById("search_result_div").innerHTML = html;
}

function showMakerMap(xml){

	g_maker_layer.clearMarkers();
	$(xml).find("poi_beijing").each(function() {
		var coordinate = $(this).find("coordinates").text();
		var xy = coordinate.split(",")
		addMarker(xy[0],xy[1])
	});
}

function addMarker(lon,lat){
	//var lonlat = new OpenLayers.LonLat (116.34057617185, 39.932930765562);
	var lonlat = new OpenLayers.LonLat (lon, lat);
	var pos = lonlat.transform(
            	new OpenLayers.Projection("EPSG:4326"),
            	g_map.getProjectionObject());

	//alert(pos.lon + "," + pos.lat);

	var icon = new OpenLayers.Icon('img/pin-32.png');
	var marker = new OpenLayers.Marker(pos, icon);
	//var marker = new OpenLayers.Marker(pos);
	marker.setOpacity(1.0);

	g_maker_layer.addMarker(marker);
}

function showList(xml){

	//获取结果显示容器
	//var div_out=document.getElementById("result_list_div").innerHTML="";

	var dataList=[];
	var row =new Object();
	//获取数据，创建表格
	$(xml).find("poi_beijing").each(function() {
		var coordinate = $(this).find("coordinates").text();
		var xy = coordinate.split(",");
		var lng = xy[0];
		var lat = xy[1];
		var name = $(this).find("name").text();
		var adr = $(this).find("address").text();
		var tag = $(this).find("tag").text();
		row={lng:lng,lat:lat,name:name,address:adr,tag:tag};
		if(row.lng!=""){
			dataList.push(row);
		}
		
	});
	num=dataList.length;
	Ext.require([
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.util.*',
		'Ext.state.*',
		'Ext.form.*'
	]);

	Ext.onReady(function(){
		// Define our data model
		Ext.define('poi', {
			extend: 'Ext.data.Model',
			fields: [ 'lng', 'lat', 'name', 'address' ,'tags']
		});

		var store = Ext.create('Ext.data.Store', {
			autoDestroy: true,
			pageSize:10,
			model: 'poi',
			proxy: {
				type: 'memory'
			},
			data: dataList,
			sorters: [{
				property: 'start',
				direction: 'DESC'
			}]
		});
		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
			autoCancel: false
		});

		var jumpToRow = function(){
			var fld = grid.down('#gotoLine');
			if (fld.isValid()) {
				grid.view.bufferedRenderer.scrollTo(fld.getValue() - 1, true);
			}    
		};
	
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
			tbar: [{
				text: 'Add POI',
				iconCls: 'employee-add',
				handler : function() {
					rowEditing.cancelEdit();

					// Create a model instance
					var r = Ext.create('poi', {
						lng: 117,
						lat: 40,
						name:"name",
						address:"address",
						tag:"tag",
						active: true
					});
					store.insert(0, r);
					var sm = grid.getSelectionModel();
					var storeData = sm.getSelected();
					var jsonData = Ext.encode(storeData );
					addToShape(jsonData);
					//rowEditing.startEdit(0, 0);
					
				}
			}, {
				itemId: 'removeEmployee',
				text: 'Remove POI',
				iconCls: 'employee-remove',
				handler: function() {
					rowEditing.cancelEdit();
					var sm = grid.getSelectionModel();
					store.remove(sm.getSelection());
					var sm = grid.getSelectionModel();
					var storeData = sm.getSelected();
					var jsonData = Ext.encode(storeData );
					removeFromShape(jsonData);
					// if (store.getCount() > 0) {
					// 	sm.select(0);
					// }
				},
				disabled: true
				}, {
					text: "保存",
					handler: function() {
						var modified = store.modified;
						updateData(modified);
				}
			}
			],
			plugins: [rowEditing],
			listeners: {
				'selectionchange': function(view, records) {
					grid.down('#removeEmployee').setDisabled(!records.length);
				}
			},
			bbar: [{
				labelWidth: 80,
				fieldLabel: 'Jump to row',
				xtype: 'numberfield',
				minValue: 1,
				maxValue: num,
				allowDecimals: false,
				itemId: 'gotoLine',
				enableKeyEvents: true,
				listeners: {
					specialkey: function(field, e){
						if (e.getKey() === e.ENTER) {
							jumpToRow();
						}
					}
				}
			}, {
				text: 'Go',
				handler: jumpToRow
			}],
			
			//bbar: pagebar,
			dockedItems: [{
				xtype: 'pagingtoolbar',
				store: store,   // same store GridPanel is using
				dock: 'bottom',
				displayInfo: true
			}]
		});
		function updateData(modified) {
	       var json = [];
	       Ext.each(modified, function(item) {
	           json.push(item.data);
	       });
	       if (json.length > 0) {
	           Ext.Ajax.request({
	               url: "...",
	               params: { data: Ext.util.JSON.encode(json) },
	               method: "POST",
	               success: function(response) {
	                   Ext.Msg.alert("信息", "数据更新成功！", function() { store.reload(); });
	               },
	               failure: function(response) {
	                   Ext.Msg.alert("警告", "数据更新失败，请稍后再试！");
	               }
	           });
	       }
	       else {
	           Ext.Msg.alert("警告", "没有任何需要更新的数据！");
	       }
	   }
	   //编辑后触发的事件，可在此进行数据有效性的验证
	   function afterEdit(e) {
	       if (e.field == "common") {
	           if (e.value == "大笨") {
	               Ext.Msg.alert("错误", "大笨是人物不是植物", function() { grid.startEditing(e.row, e.column) });
	           }
	       }
	   }

		new Ext.window.Window({
			width: 540,
			height: 400,
			title: 'POI搜索结果',
			items: grid,
			layout: 'fit',
			closable: true
		}).show();

	});
}

function showList_weather(xml){
	console.log(xml);

	//获取结果显示容器
	//var div_out=document.getElementById("result_list_div").innerHTML="";

	var dataList=[];
	var row =new Object();
	//获取数据，创建表格
	$(xml).find("weather").each(function() {
		var station_id = $(this).find("station_id").text();
		var time = $(this).find("time").text();
		var PM25_AQI_value = $(this).find("PM25_AQI_value").text();
		var PM10_AQI_value = $(this).find("PM10_AQI_value").text();
		var NO2_AQI_value = $(this).find("NO2_AQI_value").text();
		var temperature = $(this).find("temperature").text();
		var humidity = $(this).find("humidity").text();
/* 		row.station_id=station_id;
		row.time=time;
		row.PM25_AQI_value=PM25_AQI_value;
		row.PM10_AQI_value=PM10_AQI_value;
		row.NO2_AQI_value=NO2_AQI_value;
		row.temperature=temperature;
		row.humidity=humidity; */
		row={station_id:station_id,time:time,PM25_AQI_value:PM25_AQI_value,PM10_AQI_value:PM10_AQI_value,NO2_AQI_value:NO2_AQI_value,temperature:temperature,humidity:humidity};
		if(row.station_id!=""){
			dataList.push(row);
		}

	});
	num=dataList.length;
	Ext.require([
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.util.*',
		'Ext.state.*',
		'Ext.form.*'
	]);

	Ext.onReady(function(){
		// Define our data model
		Ext.define('weather', {
			extend: 'Ext.data.Model',
			fields: [ 'station_id', 'time', 'PM25_AQI_value', 'PM10_AQI_value' ,'NO2_AQI_value','temperature','humidity']
		});

		var store = Ext.create('Ext.data.Store', {
			autoDestroy: true,
			pageSize:10,
			model: 'weather',
			proxy: {
				type: 'memory'
			},
			data: dataList,
			sorters: [{
				property: 'start',
				direction: 'DESC'
			}]
		});

		var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
			autoCancel: false
		});
		
		var jumpToRow = function(){
			var fld = grid.down('#gotoLine');
			if (fld.isValid()) {
				grid.view.bufferedRenderer.scrollTo(fld.getValue() - 1, true);
			}    
		};
		var pagebar = new Ext.PagingToolbar({
			//pageSize: 3,
			store: store,
			displayInfo: true,
			beforePageText:'Page',
			afterPageText:"of "+num+"",
			displayMsg: '显示第 {0} 条到 {1} 条记录，一共 {2} 条',
			emptyMsg: "没有记录"
		});
		var grid =Ext.create('Ext.grid.Panel', {
			//renderTo: result_list_div,
			store: store,
			width: 740,
			height: 200,
			//autoHeight:true,
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
					text: 'station_id',
					width: 100,
					dataIndex: 'station_id',
				},
				{
					text: 'time',
					width: 100,
					dataIndex: 'time',
				},
				{
					text: 'PM25_AQI_value',
					width: 100,
					dataIndex: 'PM25_AQI_value',
				},
				{
					text: 'PM10_AQI_value',
					width: 100,
					dataIndex: 'PM10_AQI_value',
				},
				{
					text: 'NO2_AQI_value',
					width: 100,
					dataIndex: 'NO2_AQI_value',
				},
				{
					text: 'temperature',
					width: 100,
					dataIndex: 'temperature',
				},
				{
					text: 'humidity',
					width: 100,
					dataIndex: 'humidity',
				}
			],
			tbar: [{
				text: 'Add weather',
				iconCls: 'employee-add',
				handler : function() {
					rowEditing.cancelEdit();

					// Create a model instance
					var r = Ext.create('poi', {
						
						active: true
					});
					store.insert(0, r);
					rowEditing.startEdit(0, 0);
				}
			}, {
				itemId: 'removeEmployee',
				text: 'Remove weather',
				iconCls: 'employee-remove',
				handler: function() {
					var sm = grid.getSelectionModel();
					rowEditing.cancelEdit();
					store.remove(sm.getSelection());
					if (store.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			},
			],
			plugins: [rowEditing],
			listeners: {
				'selectionchange': function(view, records) {
					grid.down('#removeEmployee').setDisabled(!records.length);
				}
			},
			bbar: [{
				labelWidth: 80,
				fieldLabel: 'Jump to row',
				xtype: 'numberfield',
				minValue: 1,
				maxValue: num,
				allowDecimals: false,
				itemId: 'gotoLine',
				enableKeyEvents: true,
				listeners: {
					specialkey: function(field, e){
						if (e.getKey() === e.ENTER) {
							jumpToRow();
						}
					}
				}
			}, {
				text: 'Go',
				handler: jumpToRow
			},pagebar],
			
			//bbar: pagebar,
	/* 		dockedItems: [{
				xtype: 'pagingtoolbar',
				store: store,   // same store GridPanel is using
				dock: 'bottom',
				displayInfo: true
			}] */
		});
		new Ext.window.Window({
			width: 740,
			height: 400,
			title: '天气搜索结果',
			items: grid,
			layout: 'fit',
			closable: true
		}).show();

	});

}


