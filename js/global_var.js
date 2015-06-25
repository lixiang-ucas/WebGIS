var g_map = null;
var g_maker_layer = null;
var g_vector_layer = null;

//业务图层
var g_poi_layer=null;
var g_station_layer=null;
var g_bound_layer=null;

//绘图图层控件
var g_draw_control = null;
var g_pan_control=null;
var g_zoom_control=null;
var select_control = null;
var modify_control = null;
var selectedFeature=null;

//预定义全局变量
var isDrawing=false;
var sel_layer="";//选择哪个图层的数据
var localhost_ip=null;

//保存Feature
var saveStrategy = new OpenLayers.Strategy.Save();