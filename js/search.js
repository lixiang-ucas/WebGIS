
function poi_search(search_text){

/* 	markslayer = new OpenLayers.Layer.Vector("WFS", {
			strategies : [ new OpenLayers.Strategy.BBOX() ],
			protocol : new OpenLayers.Protocol.WFS({
				url : "http://localhost:8080/geoserver/wfs?",
				featureType : "poi_beijing",
				featureNS : "http://www.opengis.net/lixiang"
			}),
			styleMap : new OpenLayers.StyleMap({
				externalGraphic : 'img/marker-target.png',
				graphicWidth : 20,
				graphicHeight : 24,
				graphicYOffset : -24,
			}),//					  
			filter : new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.LIKE,
				property : "name",
				value : "*" + search_text + "*"
			})
		});
		g_map.addLayer(markslayer);
		//addPop(); */
		
		
	var url = "http://" + localhost_ip + ":8080/geoserver/lixiang/ows";
	var xml = "<wfs:GetFeature service=\"WFS\" version=\"1.0.0\" maxFeatures=\"50\" "
		 +  "xmlns:lixiang=\"http://www.opengis.net/lixiang\" "
         +  "xmlns:wfs=\"http://www.opengis.net/wfs\" "
         +  "xmlns:gml=\"http://www.opengis.net/gml\" "
         +	"xmlns:ogc=\"http://www.opengis.net/ogc\" "
         +  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
         +  "xsi:schemaLocation=\"http://www.opengis.net/wfs "
         +  " http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">"
         +  "<wfs:Query typeName=\"lixiang:poi_beijing\">"
		 +  "	<ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"
		 +  "		<ogc:PropertyIsLike wildCard=\"*\" singleChar=\"#\" escapeChar=\"!\">"
		 +  "			<ogc:PropertyName>lixiang:name</ogc:PropertyName>"
		 +  "			<ogc:Literal>*" + search_text + "*</ogc:Literal>"
		 +  "		</ogc:PropertyIsLike>"
		 +  "	</ogc:Filter>"
         +  "</wfs:Query>"
         +"</wfs:GetFeature>";
		/***********json格式的参数****/
		 /* {
			'service':'WFS',
			'version':'1.0.0',
			'request':'GetFeature',
			'typeName':'lixiang:poi_beijing',
			'maxFeatures':'50'
		}, */
	if(document.getElementById("spatial_checkbox").checked){
		if(g_vector_layer.features.length>0){
			var len=g_vector_layer.features.length;
			var geom=g_vector_layer.features[len-1].geometry;//选取最后一个vector
			// 定义GML Format对象
			
			var gml_c = new OpenLayers.Format.GML.v2({featureType: "station_location",featureNS: "http://www.opengis.net/lixiang",
				geometryName: "the_geom"});
			// Geometry 转换为 GML
			var gml = new gml_c.write(geom);
			xml = "<wfs:GetFeature service=\"WFS\" version=\"1.0.0\" maxFeatures=\"50\" "
			 +  "xmlns:lixiang=\"http://www.opengis.net/lixiang\" "
			 +  "xmlns:wfs=\"http://www.opengis.net/wfs\" "
			 +  "xmlns:gml=\"http://www.opengis.net/gml\" "
			 +	"xmlns:ogc=\"http://www.opengis.net/ogc\" "
			 +  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
			 +  "xsi:schemaLocation=\"http://www.opengis.net/wfs "
			 +  " http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">"
			 +  "<wfs:Query typeName=\"lixiang:poi_beijing\">"
			 +  "	<ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"
			 +  "		<ogc:Within>"
			 +  "			<ogc:PropertyName>lixiang:the_geom</ogc:PropertyName>"
			 +  "			<gml:Polygon>" + geom + "</gml:Polygon>"
			 +  "		</ogc:Within>"
			 +  "	</ogc:Filter>"
			 +  "</wfs:Query>"
			 +"</wfs:GetFeature>";
		}
	}
		
	$.ajax({
		type  :"post",
		url   : url,
		contentType: "text/json",
		data  :xml,
		dataType: "xml",
        //crossDomain: true,  
		async : false,
		beforeSend: function(XMLHttpRequest){
			console.log("beforeSend-->"+xml);
		},
		success : function(xml, textStatus){
			console.log("afterSend-->"+xml);
			showResults(xml);		
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error : function(){
		}
	});
	
}


function weather_search(station_id,weather_param,start_date,end_date){
	console.log(station_id+weather_param+start_date+end_date)
	var url = "http://" + localhost_ip + ":8080/geoserver/lixiang/ows";
	var xml = "<wfs:GetFeature service=\"WFS\" version=\"1.0.0\" maxFeatures=\"50\" "
		 +  "xmlns:lixiang=\"http://www.opengis.net/lixiang\" "
         +  "xmlns:wfs=\"http://www.opengis.net/wfs\" "
         +  "xmlns:gml=\"http://www.opengis.net/gml\" "
         +	"xmlns:ogc=\"http://www.opengis.net/ogc\" "
         +  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
         +  "xsi:schemaLocation=\"http://www.opengis.net/wfs "
         +  " http://schemas.opengis.net/wfs/1.1.0/wfs.xsd\">"
         +  "<wfs:Query typeName=\"lixiang:weather\">"
		 +  "	<ogc:Filter xmlns:ogc=\"http://www.opengis.net/ogc\">"
		 +  "		<ogc:PropertyIsLike wildCard=\"*\" singleChar=\"#\" escapeChar=\"!\">"
		 +  "			<ogc:PropertyName>lixiang:station_id</ogc:PropertyName>"
		 +  "			<ogc:Literal>" + station_id + "</ogc:Literal>"
		 +  "		</ogc:PropertyIsLike>"
		 +  "		<ogc:PropertyIsBetween>"
		 +  "       	<ogc:LowerBoundary>"
		 +  "				<ogc:Literal>" + start_date + "</ogc:Literal>"
		 +  "       	</ogc:LowerBoundary>"
		 +  "       	<ogc:UpperBoundary>"
		 +  "				<ogc:Literal>" + end_date + "</ogc:Literal>"
		 +  "       	</ogc:UpperBoundary>"
		 +  "       	<ogc:PropertyName>lixiang:time</ogc:PropertyName>"
		 +  "		</ogc:PropertyIsBetween>"
		 +  "	</ogc:Filter>"
         +  "</wfs:Query>"
         +"</wfs:GetFeature>";
		/***********json格式的参数****/
	
	$.ajax({
		type  :"post",
		url   : url,
		contentType: "text/json",
		data  :xml,
		dataType: "xml",
		async : false,
		beforeSend: function(XMLHttpRequest){
			console.log("beforeSend-->"+xml);
		},
		success : function(xml, textStatus){
			console.log("afterSend-->"+xml);
			showList_weather(xml);		
		},
		complete: function(XMLHttpRequest, textStatus){
		},
		error : function(){
		}
	});
	
}

