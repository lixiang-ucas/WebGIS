var saveStrategy=null;


function initMap() {
	//添加基础底图
	addLayer();

	addControl();

	addListener();

}

function addListener() {
	//注册鼠标移动事件
	g_map.events.register("mousemove", g_map, function(e) {
		var xy = g_map.getLonLatFromViewPortPx(e.xy);
		var lonlat = xy.transform(
				g_map.getProjectionObject(),
				new OpenLayers.Projection("EPSG:4326")
		)
		var position = lonlat.lon + ", " + lonlat.lat;
		OpenLayers.Util.getElement("map_mouse_pos_div").innerHTML = position;
	});

	g_map.events.register("click",g_map,function(e){
		var xy=g_map.getLonLatFromViewPortPx(e.xy);
		var lonlat = xy.transform(
				g_map.getProjectionObject(),
				new OpenLayers.Projection("EPSG:4326")
		);
		// var lonlat=new OpenLayers.LonLat(114,40);
		// addPOI(lonlat);

	});
}

function addControl() {
	g_map.addControl(new OpenLayers.Control.LayerSwitcher({
		'ascending': false
	})); //图层控制
	//g_map.addControl(new OpenLayers.Control.PanZoomBar());//缩放工具
	g_map.addControl(new OpenLayers.Control.ScaleLine()); //比例尺
	g_map.addControl(new OpenLayers.Control.OverviewMap()); //缩略图
	g_map.addControl(new OpenLayers.Control.ZoomBox()); //
	g_pan_control=new OpenLayers.Control.Pan();
	g_map.addControl(g_pan_control);
	// g_map.addControl(new OpenLayers.Control.EditingToolbar(g_vector_layer));//多边形编辑工具
	// 在Vector图层上添加图元element

	//要素编辑
	// modify_control = new OpenLayers.Control.ModifyFeature(g_vector_layer);
	// g_map.addControl(modify_control);
	// modify_control.mode = OpenLayers.Control.ModifyFeature.DRAG;

	addSelectControl(g_map, [g_bound_layer,g_poi_layer,g_station_layer]);

	// function toggleControl(_value) {
	// 	for (key in measureControls) {
	// 		var control = measureControls[key];
	// 		if (_value == key) {
	// 			control.activate();
	// 		} else {
	// 			control.deactivate();
	// 		}
	// 	}
	// }
	// addControlPanel();
}
function addConrolPanel(){
	var panel = new OpenLayers.Control.Panel({
		'displayClass': 'customEditingToolbar'
	});
	var navigate = new OpenLayers.Control.Navigation({
		title: "Pan Map"
	});
	var draw = new OpenLayers.Control.DrawFeature(
		g_poi_layer, OpenLayers.Handler.Point, {
			title: "Draw Feature",
			displayClass: "olControlDrawFeaturePoint",
			multi: true
		}
	);
	var edit = new OpenLayers.Control.ModifyFeature(g_poi_layer, {
		title: "Modify Feature",
		displayClass: "olControlModifyFeature"
	});
	// var del = new DeleteFeature(g_poi_layer, {
	// 	title: "Delete Feature"
	// });
	var save = new OpenLayers.Control.Button({
		title: "Save Changes",
		trigger: function() {
			if (edit.feature) {
				edit.selectControl.unselectAll();
			}
			saveStrategy.save();
		},
		displayClass: "olControlSaveFeatures"
	});
	panel.addControls([navigate, save, edit, draw]);
	panel.defaultControl = navigate;
	g_map.addControl(panel);

}

function ChangesSuccess() {
	alert('Done');
}

function ChangesFailed() {
	alert('Failed');
}


function addLayer() {

	g_map = new OpenLayers.Map('map_div',{projection:new OpenLayers.Projection("EPSG:4326")});

	/*   g_map = new OpenLayers.Map('map_div',{
		projection: new OpenLayers.Projection("EPSG:900913"),  
		displayProjection: new OpenLayers.Projection("EPSG:4326")
    }); */
	var g_osm_layer = new OpenLayers.Layer.OSM("osm");

	//添加业务图层，按照画家算法，先添加的放在底层
/*	g_bound_layer = new OpenLayers.Layer.WMS("北京范围", "http://" + localhost_ip + ":8080/geoserver/lixiang/wms?", {layers: "beijing_bound"},
	{
		singleTile: true,
		ratio: 1,
		isBaseLayer: true,
		visibility: true,
		// projection: new OpenLayers.Projection("EPSG:4326"),
		// displayProjection: new OpenLayers.Projection("EPSG:4326"),
	});*/

	OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
	// allow testing of specific renderers via "?renderer=Canvas", etc
	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
	renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


	saveStrategy = new OpenLayers.Strategy.Save();
	saveStrategy.events.register("success", '', ChangesSuccess);
	saveStrategy.events.register("failure", '', ChangesFailed);

	g_bound_layer= new OpenLayers.Layer.Vector ("北京范围", {
		strategies: [new OpenLayers.Strategy.BBOX(),saveStrategy],
		//projection: new OpenLayers.Projection("EPSG:4326"), 
		protocol : new OpenLayers.Protocol.WFS({		
			url:  "http://" + localhost_ip + ":8080/geoserver/wfs",
			featureType: "beijing_bound",
			featureNS: "http://www.opengis.net/lixiang",
			geometryName: "the_geom"
		}),
		//图层样式(OpenLayers.Symbolizer.Line)
		styleMap : new OpenLayers.StyleMap({					
			strokeWidth: 3,		// 边界宽度
			strokeColor: "#59D9BF",	// 边界颜色
			fillColor:"#ff0000",		// 填充颜色
			fillOpacity: 0.1,		// 填充透明度
		}),
	}); 

	g_poi_layer = new OpenLayers.Layer.Vector("POI", {
		//renderers: renderer,
		strategies : [new OpenLayers.Strategy.BBOX(),saveStrategy],
		protocol : new OpenLayers.Protocol.WFS({		
			url:  "http://" + localhost_ip + ":8080/geoserver/wfs",
			featureType: "poi_beijing",
			featureNS: "http://www.opengis.net/lixiang",
			geometryName: "the_geom"
		}),
		 //图层样式(OpenLayers.Symbolizer.Line)
		styleMap : new OpenLayers.StyleMap({					
			strokeWidth: 3,		// 边界宽度
			strokeColor: "#ff0000",	// 边界颜色
			fillColor:"#ff0000",		// 填充颜色
			fillOpacity: 0.1,		// 填充透明度
			pointRadius:2,		// 点半径
		}),
		filter : new OpenLayers.Filter.Spatial({     		
			type: OpenLayers.Filter.Spatial.BBOX,
			property: "the_geom",		// 字段名称
			value: new OpenLayers.Bounds(116.3, 40.2, 116.4, 40.3),  //BBOX
			projection: "EPSG:4326"	//  投影ID
        }),
		visibility:true,
	});

	g_station_layer = new OpenLayers.Layer.Vector("气象站", {
		//renderers: renderer,
		strategies: [new OpenLayers.Strategy.BBOX(),saveStrategy],
		protocol: new OpenLayers.Protocol.WFS({
			url: "http://" + localhost_ip + ":8080/geoserver/wfs",
			featureType: "station_location",
			featureNS: "http://www.opengis.net/lixiang",
			geometryName: "the_geom"
		}),
		styleMap: new OpenLayers.StyleMap({
			label:'${station_id}',
			strokeWidth: 3, // 边界宽度
			strokeColor: "#00ff00", // 边界颜色
			fillColor: "#00ff00", // 填充颜色
			fillOpacity: 0.1, // 填充透明度
			pointRadius: 8, // 点半径
			graphicName: 'star' // [ "star", "cross", "x", "square", 
				//"triangle", "circle", "lightning", "rectangle ]
		}),
	});

	g_map.addLayer(g_osm_layer);
	g_map.addLayer(g_bound_layer);
	g_map.addLayer(g_poi_layer);
	g_map.addLayer(g_station_layer);

	// 标记图层和绘图图层
	g_maker_layer = new OpenLayers.Layer.Markers("markers", {
		singleTile: true,
		ratio: 1,
		isBaseLayer: false,
		visibility: true,
	});
	g_vector_layer = new OpenLayers.Layer.Vector("vector", {
		singleTile: true,
		ratio: 1,
		isBaseLayer: false,
		visibility: true,
	});
	g_map.addLayer(g_maker_layer);
    g_map.addLayer(g_vector_layer);	

	g_map.setCenter(
		new OpenLayers.LonLat(116.4538, 40.1569).transform(
			new OpenLayers.Projection("EPSG:4326"),
			g_map.getProjectionObject()
		), 8
	);

}


function addSelectControl(map, vector_layer) {
	if (select_control != null) {
		return;
	}
	//alert("addSelectControl");
	select_control =
		new OpenLayers.Control.SelectFeature(vector_layer, {
			onSelect: onFeatureSelect,
			onUnselect: onFeatureUnselect,
			hover: false,
			// box:true,
			clickout:true,
			multiple:false,
		});
	map.addControl(select_control);
	//select_control.activate();
}

// Feature 选中事件响应
function onFeatureSelect(feature) {
	selectedFeature = feature;
	xy=
 	popup = new OpenLayers.Popup.FramedCloud("chicken", 
		 feature.geometry.getBounds().getCenterLonLat(),
		 null,
		 "<div style='font-size:.8em'>Feature: " + feature.id +"<br />经纬度: " + feature.geometry.x+","+feature.geometry.y+"</div>",
		 null, true, onPopupClose);
	feature.popup = popup;
	g_map.addPopup(popup); 

	//select_control.deactivate();
	//modify_control.activate();

}

// Feature取消选中事件响应
function onFeatureUnselect(feature) {
	g_map.removePopup(selectedFeature.popup);
	selectedFeature.popup.destroy();
	selectedFeature.popup = null;
}

function onPopupClose(evt) {
	select_control.unselect(selectedFeature);
	// g_map.removePopup(selectedFeature.popup);
	// selectedFeature.popup.destroy();
	// selectedFeature.popup = null;
}


/*function addFeature(wkt, layer) {
	var geometry = toGeometryFromWkt(wkt);
	if (wkt != null) {
		layer.addFeatures(geometry);
	}
}

function toGeometryFromWkt(wkt) {
	var geometry = null;
	if (wkt_reader == null) {
		wkt_reader = new OpenLayers.Format.WKT();
	}
	geometry = wkt_reader.read(wkt);
	return geometry;
}*/

/*
g_vector_layer = new OpenLayers.Layer.Vector("overlay", {
		singleTile: true,
		ratio: 1,
		isBaseLayer: false,
		visibility: true,
	});


var featureOverlay = new OpenLayers.layers FeatureOverlay({
  map: map,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#f00',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.1)'
    })
  })
});

var highlight;
var displayFeatureInfo = function(pixel) {

  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });

  var info = document.getElementById('info');
  if (feature) {
    info.innerHTML = feature.getId() + ': ' + feature.get('name');
  } else {
    info.innerHTML = '&nbsp;';
  }

  if (feature !== highlight) {
    if (highlight) {
      featureOverlay.removeFeature(highlight);
    }
    if (feature) {
      featureOverlay.addFeature(feature);
    }
    highlight = feature;
  }

};

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);
});*/