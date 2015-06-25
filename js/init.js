$().ready(function(){
	localhost_ip="localhost";
	//localhost_ip="210.77.20.56";
	initMap();
	initListener();
});

function initListener(){

	$("#search_btn").each(function(index, el) {
		$(this).click(function(){
			//清楚原来的查询结果
			$("#result_list_div").innerHTML = "";
			//释放已绘制的图层
						
			if($("#search_layer_select").val()=="POI"){
				var search_text = $("#search_text").val();
				if(search_text.length==0){
					alert("请输入查询条件");
				}
				else {
					poi_search(search_text);
					$("#search_result_div").attr("hidden",false);
				}
			}else{
				var station_id='*'
				if($("#weather_station_select").val()!="All"){
					station_id=$("#weather_station_select").val()
				}
				var weather_param="*";
				if($("#weather_param_select").val()!="All"){
					weather_param=$("#weather_param_select").val()
				}
				start_date=$("#start_date").val();
				end_date=$("#end_date").val()
				if(station_id!=""&weather_param!=""&start_date!=""&end_date!="")
				{
					weather_search(station_id,weather_param,start_date,end_date);
					$("#search_result_div").attr("hidden",false);
				}
			}
		});
	});
	


	$("#start_date").each(function(index, el) {
		$(this).change(function(event) {
			var start_date=new Date("2013/2/8");
			if($("#start_date").val()!=""){
				var dd=new Date($("#start_date").val());
				if(dd<start_date)
				{
					alert("起始时间有误，应大于2013/2/8");
				}			
			}
			else{
				alert("起始时间为空，请重新输入");
			}
		});
	});
	
	$("#end_date").each(function(index, el) {
		$(this).change(function(event) {
			var end_date=new Date("2014/2/8");
			if($("#end_date").val()!=""){
				var dd=new Date($("#end_date").val());
				if(dd>end_date)
				{
					alert("请输入查询条件，应小于2014/2/8");
				}			
			}
			else{
				alert("终止时间为空，请重新输入");
			}
		});
	});
	
	$("#search_layer_select").each(function(index, el) {
		$(this).change(function(event) {
			/* Act on the event */
			sel_layer=$(this).val();
			switch(sel_layer){
				case "POI":{
					//打开POI图层，关闭其他
					$("#search_poi").attr("hidden",false);
					$("#search_weather").attr("hidden",true);
					$("#search_result_div").attr("hidden",true);
				    g_poi_layer.setVisibility(true);
				}
				break;
				case "weather":{
					 $("#search_poi").attr("hidden",true);
					 $("#search_weather").attr("hidden",false);
					 $("#search_result_div").attr("hidden",true);
					 g_station_layer.setVisibility(true);
				}
				break;
				case "All":{
					 g_poi_layer.setVisibility(true);
					 g_station_layer.setVisibility(true);
				}
				break;
				};//switch
		});
	});

	$("#update_layer_select").each(function(index, el) {
		$(this).change(function(event) {
			/* Act on the event */
			sel_layer=$(this).val();
			switch(sel_layer){
				case "POI":{
					//打开POI图层，关闭其他
					$("#edit_attribute_poi").attr("hidden",false);
					$("#edit_attribute_station").attr("hidden",true);
				    g_poi_layer.setVisibility(true);
				}
				break;
				case "station":{
					$("#edit_attribute_poi").attr("hidden",true);
					$("#edit_attribute_station").attr("hidden",false);
					g_station_layer.setVisibility(true);
				}
				break;
				};//switch
		});
	});

	$("#add_layer_select").each(function(index, el) {
		$(this).change(function(event) {
			/* Act on the event */
			sel_layer=$(this).val();
			switch(sel_layer){
				case "POI":{
					//打开POI图层，关闭其他
					$("#add_poi").attr("hidden",false);
					$("#add_station").attr("hidden",true);
				    g_poi_layer.setVisibility(true);
				}
				break;
				case "station":{
					$("#add_poi").attr("hidden",true);
					$("#add_station").attr("hidden",false);
					g_station_layer.setVisibility(true);
				}
				break;
				};//switch
		});
	});



	$("#map_zoom").each(function(index, el) {
		$(this).click(function(event) {
			g_zoom_control.activate();
		});
	});

	$("#map_pan").each(function(index, el) {
		$(this).click(function(event) {
			// setfree();
			g_pan_control.activate();
		});
	});
	
	$("#map_sel_box").each(function(index, el) {
		$(this).click(function(event) {
			// 激活Draw Control
			//setfree();
			if(!isDrawing){
				g_draw_control = new OpenLayers.Control.DrawFeature(
                                g_vector_layer,             //DrawControl所作用的图层
                                OpenLayers.Handler.RegularPolygon);// Polgyon类型DrawControl
				g_map.addControl(g_draw_control);
				g_draw_control.activate();
				//alert("矩形框选择");
				$(this).attr("src","img/sel1.png");
				isDrawing=true;
			}
			else{
				//setfree();
				g_draw_control.deactivate();
				$(this).attr("src","img/unsel1.png");
				isDrawing=false;
			}		
		});
	});
	$("#map_sel_polygon").each(function(index, el) {
		$(this).click(function(event) {
			// 激活Draw Control
			//setfree();
			if(!isDrawing){
				g_draw_control = new OpenLayers.Control.DrawFeature(
									g_vector_layer,             //DrawControl所作用的图层
									OpenLayers.Handler.Polygon);// Polgyon类型DrawControl
				g_map.addControl(g_draw_control);
				g_draw_control.activate();
				//alert("多边形选择");
				$(this).attr("src","img/sel2.png");
				isDrawing=true;
			}
			else{
				//setfree();
				g_draw_control.deactivate();
				$(this).attr("src","img/unsel2.png");
				isDrawing=false;
			}
		});
	});
	$("#map_sel_radius").each(function(index, el) {
		$(this).click(function(event) {
			// 激活Draw Control
			//setfree();
			if(!isDrawing){
				g_draw_control = new OpenLayers.Control.DrawFeature(
									g_vector_layer,             //DrawControl所作用的图层
									OpenLayers.Handler.Box);// Polgyon类型DrawControl
				g_map.addControl(g_draw_control);
				g_draw_control.activate();
				//alert("圆形选择");
				$(this).attr("src","img/sel3.png");
				isDrawing=true;
			}
			else{
				//setfree();
				g_draw_control.deactivate();
				$(this).attr("src","img/unsel3.png");
				isDrawing=false;
			}
		});
	});
		
	$("#map_clear_features").each(function(index, el) {
		$(this).click(function(event) {
			//alert("清除图形");
			if (g_vector_layer.features.length>0) {
				g_vector_layer.removeAllFeatures();
			}
			else{
				alert("没有图形需要清除");
			}
		}); 
	});
	
	$("#map_select_feature").each(function(index, el) {
		$(this).click(function(event) {
			// setfree();
			select_control.activate();
			
		}); 
	});
	
	
	$("#map_clear_selected").each(function(index, el) {
		$(this).click(function(event) {
			alert("清除选择");
			select_control.unselect(selectedFeature);
		}); 
	});


	$("#map_add_feature").each(function(index, el) {
		$(this).click(function(event) {
			$("#search_result_div").attr("hidden",true);			
			$("#add_toolbar").attr("hidden",false);
			$("#search_box").attr("hidden",true);
			$("#edit_attr_toolbar").attr("hidden",true);
		}); 
	});

	$("#map_del_feature").each(function(index, el) {
		$(this).click(function(event) {
			$("#search_result_div").attr("hidden",true);			
			$("#add_toolbar").attr("hidden",true);
			$("#search_box").attr("hidden",true);
			$("#edit_attr_toolbar").attr("hidden",true);
			delStation();
		}); 
	});

	$("#map_search_feature").each(function(index, el) {
		$(this).click(function(event) {
			$("#add_toolbar").attr("hidden",true);
			$("#search_result_div").attr("hidden",true);
			$("#edit_attr_toolbar").attr("hidden",true);
			$("#search_box").attr("hidden",false);
		}); 
	});


	$("#map_update_feature").each(function(index, el) {
		$(this).click(function(event) {
			$("#add_toolbar").attr("hidden",true);
			$("#search_result_div").attr("hidden",true);
			$("#edit_attr_toolbar").attr("hidden",false);
			$("#search_box").attr("hidden",true);

		}); 
	});

	$("#add_poi_submit").each(function(index, el) {
		$(this).click(function(event) {
			addPOI();
		}); 
	});

	$("#add_station_submit").each(function(index, el) {
		$(this).click(function(event) {
			addStation();
		}); 
	});

	$("#edit_poi_submit").each(function(index, el) {
		$(this).click(function(event) {
			updatePOI();
		}); 
	});

	$("#edit_station_submit").each(function(index, el) {
		$(this).click(function(event) {
			updateStation();
		}); 
	});



};

function setfree() {
	if (g_draw_control instanceof OpenLayers.Control.DrawFeature
			&& g_draw_control != null) {
		g_draw_control.deactivate();
		g_map.removeControl(g_draw_control);
	}
	if (g_vector_layer != null) {
		g_vector_layer.removeAllFeatures();
	}
	if (g_select_control) {};
	g_select_control.deactivate();
	g_pan_control.deactivate();

}

