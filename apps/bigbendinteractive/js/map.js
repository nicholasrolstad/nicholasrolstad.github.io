//function to initiate map
function initiateMap(){
	
	var date = new Date( new Date().getTime() - 6 * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
	
	var topo = L.tileLayer('https://api.mapbox.com/styles/v1/midwestcoast/cjolquqbc18vm2spi7z3rpmj4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlkd2VzdGNvYXN0IiwiYSI6ImNpd3F6djN5ZTAxY3Yyb3BmM2Z4dzlrd2UifQ.ad4-hQvgRhK2ETritdMAYw', {
		attribution: '<a href="http://mapbox.com">Mapbox</a> | <a href="https://github.com/nationalparkservice/symbol-library/">NPS</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	});
	
	var sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	
	var baseMaps = {
		"Big Bend Topography": topo,
		"ESRI Satellite": sat
	};
	

    //create the map
	var map = L.map('map', {
		center: [29.268, -103.245],
		zoom: 10,
		minZoom: 9,
		maxBounds:[[28.9,-103.7],[29.9,-102.8]],
		inertia: false,
		layers: [topo]
	});
	
	//L.control.layers(baseMaps).addTo(map);
	
	function getCampsiteIcon(d) {
		return d == 'BC' ? 'images/campsiteBC.svg' :
			   d == 'RD' ? 'images/campsiteRD.svg' :
			   d == 'FC' ? 'images/campsite.svg' :
			   'none';
	};
	
	function getCampsiteStatusIcon(d) {
		return d == 'NO' ? 'images/campsiteAvailable.svg' :
			   d == 'YES' ? 'images/campsiteOccupied.svg' :
			   'none';
	};
	
	function getPOIIcon(d) {
		return d == 'Entrance' ? 'images/entrance.svg' :
			   d == 'Gas Station' ? 'images/gasstation.svg' :
			   d == 'Overlook' ? 'images/overlook.svg' :
			   d == 'Parking' ? 'images/parking.svg' :
		       d == 'Pullout' ? 'images/pullout.svg' :
		       d == 'Ranger Station' ? 'images/ranger-station.svg' :
		       d == 'River Access' ? 'images/canoe.svg' :
		       d == 'Trailhead' ? 'images/trailhead.svg' :
			   'none';
	};
	
	
	var BCcampsites = L.esri.Cluster.featureLayer({
		where: "TYPE = 'BC'",
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{NAME}</p><br><p class="conditions-label">Occupied ?</p><p class="conditions">November 20: <em><b>{OCCUPIED}</b></em><br><br>This data is accurate as of 11/19 at 12:45 P.M.</p>', layer.feature.properties));
			feature.layer = layer;
		},
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getCampsiteIcon(geojson.properties.TYPE), iconAnchor: [10, 0]}),
      		});
		},
		disableClusteringAtZoom: 15,
		polygonOptions: {
      		color: '#444',
      		weight: 4,
      		opacity: 1,
      		fillOpacity: 0.5
    		},
		iconCreateFunction: function(cluster) {
			var count = cluster.getChildCount();
			var digits = (count+'').length;
			return new L.divIcon({
        		html: count,
        		className:'clusterBC digits-'+digits,
        		iconSize: null
      		});
		}
	});
	
	
	var BCcampsitesStatus = L.esri.Cluster.featureLayer({
		where: "TYPE = 'BC'",
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{NAME}</p><br><p class="conditions-label">Occupied ?</p><p class="conditions">November 20: <em><b>{OCCUPIED}</b></em><br><br>This data is accurate as of 11/19 at 12:45 P.M.</p>', layer.feature.properties));
			feature.layer = layer;
		},
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getCampsiteStatusIcon(geojson.properties.OCCUPIED), iconAnchor: [10, 0]}),
      		});
		},
		disableClusteringAtZoom: 15,
		polygonOptions: {
      		color: '#444',
      		weight: 4,
      		opacity: 1,
      		fillOpacity: 0.5
    		},
		iconCreateFunction: function(cluster) {
			var count = cluster.getChildCount();
			var digits = (count+'').length;
			return new L.divIcon({
        		html: count,
        		className:'clusterBC digits-'+digits,
        		iconSize: null
      		});
		}
	});
	
	
	var RDcampsitesStatus = L.esri.Cluster.featureLayer({
		where: "TYPE = 'RD'",
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{NAME}</p><br><p class="conditions-label">Occupied ?</p><p class="conditions">November 20: <em><b>{OCCUPIED}</b></em><br><br>This data is accurate as of 11/19 at 12:45 P.M.</p>', layer.feature.properties));
			feature.layer = layer;
		},
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getCampsiteStatusIcon(geojson.properties.OCCUPIED), iconAnchor: [10, 0]}),
      		});
		},
		disableClusteringAtZoom: 15,
		polygonOptions: {
      		color: '#444',
      		weight: 4,
      		opacity: 1,
      		fillOpacity: 0.5
    		},
		iconCreateFunction: function(cluster) {
			var count = cluster.getChildCount();
			var digits = (count+'').length;
			return new L.divIcon({
        		html: count,
        		className:'clusterRD digits-'+digits,
        		iconSize: null
      		});
		}
	});
	
	
	var RDcampsites = L.esri.Cluster.featureLayer({
		where: "TYPE = 'RD'",
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{NAME}</p><br><p class="conditions-label">Occupied ?</p><p class="conditions">November 20: <em><b>{OCCUPIED}</b></em><br><br>This data is accurate as of 11/19 at 12:45 P.M.</p>', layer.feature.properties));
			feature.layer = layer;
		},
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getCampsiteIcon(geojson.properties.TYPE)})
      		});
		},
		disableClusteringAtZoom: 15,
		polygonOptions: {
      		color: '#665229',
      		weight: 4,
      		opacity: 1,
      		fillOpacity: 0.5
    		},
		iconCreateFunction: function(cluster) {
			var count = cluster.getChildCount();
			var digits = (count+'').length;
			return new L.divIcon({
        		html: count,
        		className:'clusterRD digits-'+digits,
        		iconSize: null
      		});
		}
	});
	
	var FCcampsites = L.esri.Cluster.featureLayer({
		where: "TYPE = 'FC'",
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getCampsiteIcon(geojson.properties.TYPE)})
      		});
		},
		disableClusteringAtZoom: 15,
		polygonOptions: {
      		color: '#665229',
      		weight: 4,
      		opacity: 1,
      		fillOpacity: 0.5
    		},
		iconCreateFunction: function(cluster) {
			var count = cluster.getChildCount();
			var digits = (count+'').length;
			return new L.divIcon({
        		html: count,
        		className:'clusterRD digits-'+digits,
        		iconSize: null
      		});
		}
	});

	
	var trails = L.esri.featureLayer({
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/big_bend_trails_wgs84/FeatureServer/0',
		style: {
			weight: 3,
			dashArray: '4 1 4',
			opacity: 1,
			color: '#7c6a5d'
		}
	});
	
	var trailExtend = L.esri.featureLayer({
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/big_bend_trails_wgs84/FeatureServer/0',
		style: {
			weight: 15,
			opacity: 0,
			color: '#000',
			lineCap: 'butt'
		},
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{TRLNAME}</p><p class="info">{LENGTH} Miles</p><br><p class="conditions-label">Conditions</p><p class="conditions">{CONDITIONS}</p><br><form onsubmit=\"return false;\" id=\"add-condition-form\">Update Conditions:<br><input id=\"conditions\" type=\"text\" name=\"conditions\"><br>Date:<br><input type=\"date\" id= \"date\" name=\"date\"><br><br><input type=\"submit\" id=\"bt1\"> </form>', layer.feature.properties))
		}
	});
	
	
	trailExtend.on('mouseover', function(e) {
		trailExtend.setFeatureStyle(e.layer.feature.id, {
			weight: 15,
			opacity: .2,
			color: '#000',
			lineCap: 'butt'
		});
	});
	
	trailExtend.on('click', function(e) {
		$('#add-condition-form').submit(function(){
			e.layer.feature.properties['CONDITIONS'] = $('#date').val() +': '+ $('#conditions').val();
			$('#add-condition-form').trigger("reset");
			var trlname = e.layer.feature.properties.TRLNAME;
			trailExtend.eachFeature(function(layer){
				if (layer.feature.properties.TRLNAME == trlname) {
					layer.bindPopup(L.Util.template('<p class="title">{TRLNAME}</p><p class="info">{LENGTH} Miles</p><br><p class="conditions-label">Conditions</p><p class="conditions">{CONDITIONS}</p><br><form onsubmit=\"return false;\" id=\"add-condition-form\">Update Conditions:<br><input id=\"conditions\" type=\"text\" name=\"conditions\"><br>Date:<br><input type=\"date\" name=\"date\"><br><br><input type=\"submit\" id=\"bt1\"> </form>', e.layer.feature.properties))
				}
			})
		})
	});
	
	trailExtend.on('mouseout', function(e) {
		trailExtend.setFeatureStyle(e.layer.feature.id, {
			weight: 15,
			opacity: 0,
			color: '#000',
			lineCap: 'butt'
		});
	});

	function getRoadStyle(d) {
		return d == 'Native or Dirt' ? {weight: 2, opacity: .6, color: '#544636'} :
			   d == 'Asphalt' ? {weight: 2, opacity: .8, color: '#444'} :
			   'none';
	};
	
	
	var roads = L.esri.featureLayer({
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Roads_WGS84/FeatureServer/0',
		onEachFeature: function(geojson, feature) {
			feature.setStyle(getRoadStyle(geojson.properties.RDSURFACE));
		}
	});
	
	var roadExtend = L.esri.featureLayer({
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Roads_WGS84/FeatureServer/0',
		style: {
			weight: 15,
			opacity: 0,
			color: '#000',
			lineCap: 'butt'
		},
		onEachFeature: function (feature, layer) {
			layer.bindPopup(L.Util.template('<p class="title">{RDNAME}</p><p class="info">{Length} Miles</p><br><p class="conditions-label">Conditions</p><p class="conditions">{CONDITIONS}</p><br><form onsubmit=\"return false;\" id=\"add-condition-form\">Update Conditions:<br><input id=\"conditions\" type=\"text\" name=\"conditions\"><br>Date:<br><input type=\"date\" name=\"date\"><br><br><input type=\"submit\" id=\"bt1\"> </form>', layer.feature.properties))
		},
	});
	
	roadExtend.on('mouseover', function(e) {
		roadExtend.setFeatureStyle(e.layer.feature.id, {
			weight: 15,
			opacity: .2,
			color: '#000',
			lineCap: 'butt'
		});
	});
	
	roadExtend.on('mouseout', function(e) {
		roadExtend.setFeatureStyle(e.layer.feature.id, {
			weight: 15,
			opacity: 0,
			color: '#000',
			lineCap: 'butt'
		});
	});
	
	
	
	var trailheads = L.esri.featureLayer({
		where: "POITYPE = 'Trailhead'",
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_POI_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: 'images/trailhead30.svg'}),
				iconAnchor: [15, 15]
      		});
		}
	});
	
	var POI = L.esri.featureLayer({
		where: "POITYPE <> 'Trailhead' AND POITYPE <> 'Campground'",
		url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_POI_WGS84/FeatureServer/0',
	    pointToLayer: function (geojson, latlng) {
      		return L.marker(latlng, {
        		icon: L.icon({iconUrl: getPOIIcon(geojson.properties.POITYPE)}),
				iconAnchor: [15, 15]
      		});
		}
	});
	
	
	
	
	var searchControl = L.esri.Geocoding.geosearch({
		providers: [
		  L.esri.Geocoding.featureLayerProvider({
			url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Campsites_WGS84/FeatureServer/0',
			searchFields: ['NAME'],
			label: 'Campsites',
			bufferRadius: 10,
			formatSuggestion: function(feature){
			  return feature.properties.NAME;
			}
		  }),
		  L.esri.Geocoding.featureLayerProvider({
			url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_POI_WGS84/FeatureServer/0',
			searchFields: ['POINAME'],
			label: 'POI',
			bufferRadius: 10,
			formatSuggestion: function(feature){
			  return feature.properties.POINAME;
			}
		  }),
		  L.esri.Geocoding.featureLayerProvider({
			url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Big_Bend_Roads_WGS84/FeatureServer/0',
			searchFields: ['RDNAME'],
			label: 'Roads',
			bufferRadius: 10,
			formatSuggestion: function(feature){
			  return feature.properties.RDNAME;
			}
		  }),
		  L.esri.Geocoding.featureLayerProvider({
			url: 'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/big_bend_trails_wgs84/FeatureServer/0',
			searchFields: ['TRLNAME'],
			label: 'Trails',
			bufferRadius: 10,
			formatSuggestion: function(feature){
			  return feature.properties.TRLNAME;
			}
		  })
		],
		zoomToResult: true,
		useMapBounds: false,
		placeholder: 'Search for Park Features...'
	  }).addTo(map);
	
	roads.addTo(map);
	roadExtend.addTo(map);
	
	
	//const hikingBlurb = "Take a short day hike along the Rio Grande or plan a multi-day tour of the Chisos. Check out this map to view Big Bend's trailheads, trails and backcountry campsites."
	//const drivingBlurb = "Travel to the viewpoints along the main park roads or get off pavement and head for one of the many remote primative campsites. Check out this map to view Big Bend's park roads, backcountry roads and car-camping options."
	//const generalBlurb = "Want to see it all ? This map lets you control what park features you'd like to checkout."
	const hikingLayers = '<button id="roads-btn" class="layer-btn-selected">Roads</button><button id="trails-btn" class="layer-btn-selected">Trails</button><button id="trailheads-btn" class="layer-btn">Trailheads</button><button id="BCcamp-btn" class="layer-btn-selected">Backpacking Campsites</button><button id="BCcamp-status-btn" class="layer-btn">Backpacking Campsite Status</button>'
	const drivingLayers = '<button id="roads-btn" class="layer-btn-selected">Roads</button><button id="FCcamp-btn" class="layer-btn-selected">Car Access Campsites</button><button id="FCcamp-status-btn" class="layer-btn">Car Access Campsite Status</button><button id="POI-btn" class="layer-btn">Points of Interest</button>'
	const generalLayers = '<button id="roads-btn" class="layer-btn-selected">Roads</button><button id="trails-btn" class="layer-btn">Trails</button><button id="trailheads-btn" class="layer-btn">Trailheads</button><button id="BCcamp-btn" class="layer-btn">Backpacking Campsites</button><button id="FCcamp-btn" class="layer-btn">Car Access Campsites</button><button id="POI-btn" class="layer-btn">Points of Interest</button>'
	
	
	$('#hiking-btn').click(function() {
		$('#hiking-btn').addClass('theme-btn-selected');
		$('#hiking-btn').removeClass('theme-btn');
		$('#driving-btn').removeClass('theme-btn-selected');
		$('#driving-btn').addClass('theme-btn');
		$('#general-btn').removeClass('theme-btn-selected');
		$('#general-btn').addClass('theme-btn');
		//$(".blurb").text(hikingBlurb);
		$(".theme-controls").html(hikingLayers);
		createLayerListeners();
		clearAllLayers();
		roads.addTo(map);
		roadExtend.addTo(map);
		trails.addTo(map);
		trailExtend.addTo(map);
		BCcampsites.addTo(map);
		clearLegend();
		$('#trails-legend').removeClass('legend-item-removed')
		$('#trails-legend-symbol').removeClass('item-symbol-removed')
		$('#trails-legend-label').removeClass('item-label-removed')
		$('#trails-legend').addClass('legend-item')
		$('#trails-legend-symbol').addClass('item-symbol')
		$('#trails-legend-label').addClass('item-label')
		$('#UProads-legend').removeClass('legend-item-removed')
		$('#UProads-legend-symbol').removeClass('item-symbol-removed')
		$('#UProads-legend-label').removeClass('item-label-removed')
		$('#UProads-legend').addClass('legend-item')
		$('#UProads-legend-symbol').addClass('item-symbol')
		$('#UProads-legend-label').addClass('item-label')
		$('#Proads-legend').removeClass('legend-item-removed')
		$('#Proads-legend-symbol').removeClass('item-symbol-removed')
		$('#Proads-legend-label').removeClass('item-label-removed')
		$('#Proads-legend').addClass('legend-item')
		$('#Proads-legend-symbol').addClass('item-symbol')
		$('#Proads-legend-label').addClass('item-label')
		$('#BCcampsite-legend').removeClass('legend-item-removed')
		$('#BCcampsite-legend-symbol').removeClass('item-symbol-removed')
		$('#BCcampsite-legend-label').removeClass('item-label-removed')
		$('#BCcampsite-legend').addClass('legend-item')
		$('#BCcampsite-legend-symbol').addClass('item-symbol')
		$('#BCcampsite-legend-label').addClass('item-label')
		
	});

	$('#driving-btn').click(function() {
		$('#hiking-btn').removeClass('theme-btn-selected');
		$('#driving-btn').removeClass('theme-btn');
		$('#hiking-btn').addClass('theme-btn');
		$('#driving-btn').addClass('theme-btn-selected');
		$('#general-btn').removeClass('theme-btn-selected');
		$('#general-btn').addClass('theme-btn');
		//$(".blurb").text(drivingBlurb);
		$(".theme-controls").html(drivingLayers);
		createLayerListeners();
		clearAllLayers();
		roads.addTo(map);
		roadExtend.addTo(map);
		RDcampsites.addTo(map);
		clearLegend();
		$('#RDcampsite-legend').removeClass('legend-item-removed')
		$('#RDcampsite-legend-symbol').removeClass('item-symbol-removed')
		$('#RDcampsite-legend-label').removeClass('item-label-removed')
		$('#RDcampsite-legend').addClass('legend-item')
		$('#RDcampsite-legend-symbol').addClass('item-symbol')
		$('#RDcampsite-legend-label').addClass('item-label')
		$('#UProads-legend').removeClass('legend-item-removed')
		$('#UProads-legend-symbol').removeClass('item-symbol-removed')
		$('#UProads-legend-label').removeClass('item-label-removed')
		$('#UProads-legend').addClass('legend-item')
		$('#UProads-legend-symbol').addClass('item-symbol')
		$('#UProads-legend-label').addClass('item-label')
		$('#Proads-legend').removeClass('legend-item-removed')
		$('#Proads-legend-symbol').removeClass('item-symbol-removed')
		$('#Proads-legend-label').removeClass('item-label-removed')
		$('#Proads-legend').addClass('legend-item')
		$('#Proads-legend-symbol').addClass('item-symbol')
		$('#Proads-legend-label').addClass('item-label')
	});

	$('#general-btn').click(function() {
		$('#general-btn').removeClass('theme-btn');
		$('#hiking-btn').removeClass('theme-btn-selected');
		$('#hiking-btn').addClass('theme-btn');
		$('#driving-btn').removeClass('theme-btn-selected');
		$('#driving-btn').addClass('theme-btn');
		$('#general-btn').addClass('theme-btn-selected');
		//$(".blurb").text(generalBlurb);
		$(".theme-controls").html(generalLayers);
		createLayerListeners();
		clearAllLayers();
		roads.addTo(map);
		roadExtend.addTo(map);
		clearLegend();
		$('#UProads-legend').removeClass('legend-item-removed')
		$('#UProads-legend-symbol').removeClass('item-symbol-removed')
		$('#UProads-legend-label').removeClass('item-label-removed')
		$('#UProads-legend').addClass('legend-item')
		$('#UProads-legend-symbol').addClass('item-symbol')
		$('#UProads-legend-label').addClass('item-label')
		$('#Proads-legend').removeClass('legend-item-removed')
		$('#Proads-legend-symbol').removeClass('item-symbol-removed')
		$('#Proads-legend-label').removeClass('item-label-removed')
		$('#Proads-legend').addClass('legend-item')
		$('#Proads-legend-symbol').addClass('item-symbol')
		$('#Proads-legend-label').addClass('item-label')
	});
	
	
	function createLayerListeners() {
		$('#roads-btn').click(function () {
			$('#roads-btn').toggleClass('layer-btn');
			$('#roads-btn').toggleClass('layer-btn-selected');
			$('#UProads-legend').toggleClass('legend-item');
			$('#UProads-legend').toggleClass('legend-item-removed');
			$('#UProads-legend-symbol').toggleClass('item-symbol');
			$('#UProads-legend-symbol').toggleClass('item-symbol-removed');
			$('#UProads-legend-label').toggleClass('item-label');
			$('#UProads-legend-label').toggleClass('item-label-removed');
			$('#Proads-legend').toggleClass('legend-item');
			$('#Proads-legend').toggleClass('legend-item-removed');
			$('#Proads-legend-symbol').toggleClass('item-symbol');
			$('#Proads-legend-symbol').toggleClass('item-symbol-removed');
			$('#Proads-legend-label').toggleClass('item-label');
			$('#Proads-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(roads) == true) {
				map.removeLayer(roads);
				map.removeLayer(roadExtend);
			} else {
				map.addLayer(roads);
				map.addLayer(roadExtend);
			};
		});

		$('#trails-btn').click(function () {
			$('#trails-btn').toggleClass('layer-btn');
			$('#trails-btn').toggleClass('layer-btn-selected');
			$('#trails-legend').toggleClass('legend-item');
			$('#trails-legend').toggleClass('legend-item-removed');
			$('#trails-legend-symbol').toggleClass('item-symbol');
			$('#trails-legend-symbol').toggleClass('item-symbol-removed');
			$('#trails-legend-label').toggleClass('item-label');
			$('#trails-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(trails) == true) {
				map.removeLayer(trails);
				map.removeLayer(trailExtend);
			} else {
				map.addLayer(trails);
				map.addLayer(trailExtend);
			};
		});

		$('#trailheads-btn').click(function () {
			$('#trailheads-btn').toggleClass('layer-btn');
			$('#trailheads-btn').toggleClass('layer-btn-selected');
			$('#trailhead-legend').toggleClass('legend-item');
			$('#trailhead-legend').toggleClass('legend-item-removed');
			$('#trailhead-legend-symbol').toggleClass('item-symbol');
			$('#trailhead-legend-symbol').toggleClass('item-symbol-removed');
			$('#trailhead-legend-label').toggleClass('item-label');
			$('#trailhead-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(trailheads) == true) {
				map.removeLayer(trailheads);
			} else {
				map.addLayer(trailheads);
			};
		});

		$('#BCcamp-btn').click(function () {
			$('#BCcamp-btn').toggleClass('layer-btn');
			$('#BCcamp-btn').toggleClass('layer-btn-selected');
			$('#BCcampsite-legend').toggleClass('legend-item');
			$('#BCcampsite-legend').toggleClass('legend-item-removed');
			$('#BCcampsite-legend-symbol').toggleClass('item-symbol');
			$('#BCcampsite-legend-symbol').toggleClass('item-symbol-removed');
			$('#BCcampsite-legend-label').toggleClass('item-label');
			$('#BCcampsite-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(BCcampsites) == true) {
				map.removeLayer(BCcampsites);
			} else {
				map.addLayer(BCcampsites);
				if (map.hasLayer(BCcampsitesStatus) == true) {
					map.removeLayer(BCcampsitesStatus)
					$('#BCcamp-status-btn').toggleClass('layer-btn');
					$('#BCcamp-status-btn').toggleClass('layer-btn-selected');
					$('#campsiteAvailable-legend').toggleClass('legend-item');
					$('#campsiteAvailable-legend').toggleClass('legend-item-removed');
					$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol');
					$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol-removed');
					$('#campsiteAvailable-legend-label').toggleClass('item-label');
					$('#campsiteAvailable-legend-label').toggleClass('item-label-removed');
					$('#campsiteOccupied-legend').toggleClass('legend-item');
					$('#campsiteOccupied-legend').toggleClass('legend-item-removed');
					$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol');
					$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol-removed');
					$('#campsiteOccupied-legend-label').toggleClass('item-label');
					$('#campsiteOccupied-legend-label').toggleClass('item-label-removed');
				}
			};
		});
		
		
		$('#BCcamp-status-btn').click(function () {
			$('#BCcamp-status-btn').toggleClass('layer-btn');
			$('#BCcamp-status-btn').toggleClass('layer-btn-selected');
			$('#campsiteAvailable-legend').toggleClass('legend-item');
			$('#campsiteAvailable-legend').toggleClass('legend-item-removed');
			$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol');
			$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol-removed');
			$('#campsiteAvailable-legend-label').toggleClass('item-label');
			$('#campsiteAvailable-legend-label').toggleClass('item-label-removed');
			$('#campsiteOccupied-legend').toggleClass('legend-item');
			$('#campsiteOccupied-legend').toggleClass('legend-item-removed');
			$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol');
			$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol-removed');
			$('#campsiteOccupied-legend-label').toggleClass('item-label');
			$('#campsiteOccupied-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(BCcampsitesStatus) == true) {
				map.removeLayer(BCcampsitesStatus);
			} else {
				map.addLayer(BCcampsitesStatus);
				if (map.hasLayer(BCcampsites) == true) {
					map.removeLayer(BCcampsites)
					$('#BCcamp-btn').toggleClass('layer-btn');
					$('#BCcamp-btn').toggleClass('layer-btn-selected');
					$('#BCcampsite-legend').toggleClass('legend-item');
					$('#BCcampsite-legend').toggleClass('legend-item-removed');
					$('#BCcampsite-legend-symbol').toggleClass('item-symbol');
					$('#BCcampsite-legend-symbol').toggleClass('item-symbol-removed');
					$('#BCcampsite-legend-label').toggleClass('item-label');
					$('#BCcampsite-legend-label').toggleClass('item-label-removed');
				}
			};
		});
		
		
		$('#POI-btn').click(function () {
			$('#POI-btn').toggleClass('layer-btn');
			$('#POI-btn').toggleClass('layer-btn-selected');
			$('#canoe-legend').toggleClass('legend-item');
			$('#canoe-legend').toggleClass('legend-item-removed');
			$('#canoe-legend-symbol').toggleClass('item-symbol');
			$('#canoe-legend-symbol').toggleClass('item-symbol-removed');
			$('#canoe-legend-label').toggleClass('item-label');
			$('#canoe-legend-label').toggleClass('item-label-removed');
			$('#entrance-legend').toggleClass('legend-item');
			$('#entrance-legend').toggleClass('legend-item-removed');
			$('#entrance-legend-symbol').toggleClass('item-symbol');
			$('#entrance-legend-symbol').toggleClass('item-symbol-removed');
			$('#entrance-legend-label').toggleClass('item-label');
			$('#entrance-legend-label').toggleClass('item-label-removed');
			$('#gasstation-legend').toggleClass('legend-item');
			$('#gasstation-legend').toggleClass('legend-item-removed');
			$('#gasstation-legend-symbol').toggleClass('item-symbol');
			$('#gasstation-legend-symbol').toggleClass('item-symbol-removed');
			$('#gasstation-legend-label').toggleClass('item-label');
			$('#gasstation-legend-label').toggleClass('item-label-removed');
			$('#overlook-legend').toggleClass('legend-item');
			$('#overlook-legend').toggleClass('legend-item-removed');
			$('#overlook-legend-symbol').toggleClass('item-symbol');
			$('#overlook-legend-symbol').toggleClass('item-symbol-removed');
			$('#overlook-legend-label').toggleClass('item-label');
			$('#overlook-legend-label').toggleClass('item-label-removed');
			$('#parking-legend').toggleClass('legend-item');
			$('#parking-legend').toggleClass('legend-item-removed');
			$('#parking-legend-symbol').toggleClass('item-symbol');
			$('#parking-legend-symbol').toggleClass('item-symbol-removed');
			$('#parking-legend-label').toggleClass('item-label');
			$('#parking-legend-label').toggleClass('item-label-removed');
			$('#pullout-legend').toggleClass('legend-item');
			$('#pullout-legend').toggleClass('legend-item-removed');
			$('#pullout-legend-symbol').toggleClass('item-symbol');
			$('#pullout-legend-symbol').toggleClass('item-symbol-removed');
			$('#pullout-legend-label').toggleClass('item-label');
			$('#pullout-legend-label').toggleClass('item-label-removed');
			$('#ranger-station-legend').toggleClass('legend-item');
			$('#ranger-station-legend').toggleClass('legend-item-removed');
			$('#ranger-station-legend-symbol').toggleClass('item-symbol');
			$('#ranger-station-legend-symbol').toggleClass('item-symbol-removed');
			$('#ranger-station-legend-label').toggleClass('item-label');
			$('#ranger-station-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(POI) == true) {
				map.removeLayer(POI);
			} else {
				map.addLayer(POI);
			};
		});

		$('#FCcamp-btn').click(function () {
			$('#FCcamp-btn').toggleClass('layer-btn');
			$('#FCcamp-btn').toggleClass('layer-btn-selected');
			$('#RDcampsite-legend').toggleClass('legend-item');
			$('#RDcampsite-legend').toggleClass('legend-item-removed');
			$('#RDcampsite-legend-symbol').toggleClass('item-symbol');
			$('#RDcampsite-legend-symbol').toggleClass('item-symbol-removed');
			$('#RDcampsite-legend-label').toggleClass('item-label');
			$('#RDcampsite-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(RDcampsites) == true) {
				map.removeLayer(RDcampsites);
			} else {
				map.addLayer(RDcampsites);
				if (map.hasLayer(RDcampsitesStatus) == true) {
					map.removeLayer(RDcampsitesStatus);
					$('#FCcamp-status-btn').toggleClass('layer-btn');
					$('#FCcamp-status-btn').toggleClass('layer-btn-selected');
					$('#campsiteAvailable-legend').toggleClass('legend-item');
					$('#campsiteAvailable-legend').toggleClass('legend-item-removed');
					$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol');
					$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol-removed');
					$('#campsiteAvailable-legend-label').toggleClass('item-label');
					$('#campsiteAvailable-legend-label').toggleClass('item-label-removed');
					$('#campsiteOccupied-legend').toggleClass('legend-item');
					$('#campsiteOccupied-legend').toggleClass('legend-item-removed');
					$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol');
					$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol-removed');
					$('#campsiteOccupied-legend-label').toggleClass('item-label');
					$('#campsiteOccupied-legend-label').toggleClass('item-label-removed');
				}
			};
		});
		
		$('#FCcamp-status-btn').click(function () {
			$('#FCcamp-status-btn').toggleClass('layer-btn');
			$('#FCcamp-status-btn').toggleClass('layer-btn-selected');
			$('#campsiteAvailable-legend').toggleClass('legend-item');
			$('#campsiteAvailable-legend').toggleClass('legend-item-removed');
			$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol');
			$('#campsiteAvailable-legend-symbol').toggleClass('item-symbol-removed');
			$('#campsiteAvailable-legend-label').toggleClass('item-label');
			$('#campsiteAvailable-legend-label').toggleClass('item-label-removed');
			$('#campsiteOccupied-legend').toggleClass('legend-item');
			$('#campsiteOccupied-legend').toggleClass('legend-item-removed');
			$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol');
			$('#campsiteOccupied-legend-symbol').toggleClass('item-symbol-removed');
			$('#campsiteOccupied-legend-label').toggleClass('item-label');
			$('#campsiteOccupied-legend-label').toggleClass('item-label-removed');
			if (map.hasLayer(RDcampsitesStatus) == true) {
				map.removeLayer(RDcampsitesStatus);
			} else {
				map.addLayer(RDcampsitesStatus);
				if (map.hasLayer(RDcampsites) == true) {
					map.removeLayer(RDcampsites);
					$('#FCcamp-btn').toggleClass('layer-btn');
					$('#FCcamp-btn').toggleClass('layer-btn-selected');
					$('#RDcampsite-legend').toggleClass('legend-item');
					$('#RDcampsite-legend').toggleClass('legend-item-removed');
					$('#RDcampsite-legend-symbol').toggleClass('item-symbol');
					$('#RDcampsite-legend-symbol').toggleClass('item-symbol-removed');
					$('#RDcampsite-legend-label').toggleClass('item-label');
					$('#RDcampsite-legend-label').toggleClass('item-label-removed');
				}
			};
		});

	};
	
	
	function clearAllLayers() {
		if (map.hasLayer(roads) == true) {
			map.removeLayer(roads);
			map.removeLayer(roadExtend);
		};
		if (map.hasLayer(trails) == true) {
			map.removeLayer(trails);
			map.removeLayer(trailExtend);
		};
		if (map.hasLayer(trailheads) == true) {
			map.removeLayer(trailheads);
		};
		if (map.hasLayer(BCcampsites) == true) {
			map.removeLayer(BCcampsites);
		};
		if (map.hasLayer(BCcampsitesStatus) == true) {
			map.removeLayer(BCcampsitesStatus);
		};
		if (map.hasLayer(RDcampsites) == true) {
			map.removeLayer(RDcampsites);
		};
		if (map.hasLayer(RDcampsitesStatus) == true) {
			map.removeLayer(RDcampsitesStatus);
		};
		if (map.hasLayer(POI) == true) {
			map.removeLayer(POI);
		};
		
	};
	
	function clearLegend() {
		$('#RDcampsite-legend').removeClass('legend-item')
		$('#RDcampsite-legend').addClass('legend-item-removed')
		$('#RDcampsite-legend-symbol').removeClass('item-symbol')
		$('#RDcampsite-legend-symbol').addClass('item-symbol-removed')
		$('#RDcampsite-legend-label').removeClass('item-label')
		$('#RDcampsite-legend-label').addClass('item-label-removed')
		
		$('#BCcampsite-legend').removeClass('legend-item')
		$('#BCcampsite-legend').addClass('legend-item-removed')
		$('#BCcampsite-legend-symbol').removeClass('item-symbol')
		$('#BCcampsite-legend-symbol').addClass('item-symbol-removed')
		$('#BCcampsite-legend-label').removeClass('item-label')
		$('#BCcampsite-legend-label').addClass('item-label-removed')
		
		$('#trailhead-legend').removeClass('legend-item')
		$('#trailhead-legend').addClass('legend-item-removed')
		$('#trailhead-legend-symbol').removeClass('item-symbol')
		$('#trailhead-legend-symbol').addClass('item-symbol-removed')
		$('#trailhead-legend-label').removeClass('item-label')
		$('#trailhead-legend-label').addClass('item-label-removed')
		
		$('#trails-legend').removeClass('legend-item')
		$('#trails-legend').addClass('legend-item-removed')
		$('#trails-legend-symbol').removeClass('item-symbol')
		$('#trails-legend-symbol').addClass('item-symbol-removed')
		$('#trails-legend-label').removeClass('item-label')
		$('#trails-legend-label').addClass('item-label-removed')
		
		$('#UProads-legend').removeClass('legend-item')
		$('#UProads-legend').addClass('legend-item-removed')
		$('#UProads-legend-symbol').removeClass('item-symbol')
		$('#UProads-legend-symbol').addClass('item-symbol-removed')
		$('#UProads-legend-label').removeClass('item-label')
		$('#UProads-legend-label').addClass('item-label-removed')
		$('#Proads-legend').removeClass('legend-item')
		$('#Proads-legend').addClass('legend-item-removed')
		$('#Proads-legend-symbol').removeClass('item-symbol')
		$('#Proads-legend-symbol').addClass('item-symbol-removed')
		$('#Proads-legend-label').removeClass('item-label')
		$('#Proads-legend-label').addClass('item-label-removed')
		
		$('#canoe-legend').removeClass('legend-item');
		$('#canoe-legend').addClass('legend-item-removed');
		$('#canoe-legend-symbol').removeClass('item-symbol');
		$('#canoe-legend-symbol').addClass('item-symbol-removed');
		$('#canoe-legend-label').removeClass('item-label');
		$('#canoe-legend-label').addClass('item-label-removed');
		$('#entrance-legend').removeClass('legend-item');
		$('#entrance-legend').addClass('legend-item-removed');
		$('#entrance-legend-symbol').removeClass('item-symbol');
		$('#entrance-legend-symbol').addClass('item-symbol-removed');
		$('#entrance-legend-label').removeClass('item-label');
		$('#entrance-legend-label').addClass('item-label-removed');
		$('#gasstation-legend').removeClass('legend-item');
		$('#gasstation-legend').addClass('legend-item-removed');
		$('#gasstation-legend-symbol').removeClass('item-symbol');
		$('#gasstation-legend-symbol').addClass('item-symbol-removed');
		$('#gasstation-legend-label').removeClass('item-label');
		$('#gasstation-legend-label').addClass('item-label-removed');
		$('#overlook-legend').removeClass('legend-item');
		$('#overlook-legend').addClass('legend-item-removed');
		$('#overlook-legend-symbol').removeClass('item-symbol');
		$('#overlook-legend-symbol').addClass('item-symbol-removed');
		$('#overlook-legend-label').removeClass('item-label');
		$('#overlook-legend-label').addClass('item-label-removed');
		$('#parking-legend').removeClass('legend-item');
		$('#parking-legend').addClass('legend-item-removed');
		$('#parking-legend-symbol').removeClass('item-symbol');
		$('#parking-legend-symbol').addClass('item-symbol-removed');
		$('#parking-legend-label').removeClass('item-label');
		$('#parking-legend-label').addClass('item-label-removed');
		$('#pullout-legend').removeClass('legend-item');
		$('#pullout-legend').addClass('legend-item-removed');
		$('#pullout-legend-symbol').removeClass('item-symbol');
		$('#pullout-legend-symbol').addClass('item-symbol-removed');
		$('#pullout-legend-label').removeClass('item-label');
		$('#pullout-legend-label').addClass('item-label-removed');
		$('#ranger-station-legend').removeClass('legend-item');
		$('#ranger-station-legend').addClass('legend-item-removed');
		$('#ranger-station-legend-symbol').removeClass('item-symbol');
		$('#ranger-station-legend-symbol').addClass('item-symbol-removed');
		$('#ranger-station-legend-label').removeClass('item-label');
		$('#ranger-station-legend-label').addClass('item-label-removed');
	};
	
	createLayerListeners();
	
	
	/*
	var addConditionMarker;
	
	
	function getIcon(d) {
		return d == 'Flooding' ? 'img/flood.png' :
			d == 'Ice/Snow' ? 'img/snow.png' :
			d == 'Damage' ? 'img/roadconditions.png' :
			d == 'Construction' ? 'img/construction.png' :
			d == 'Crime' ? 'img/crime.png' :
			'none';
	};

	function functSubmit(event) {
		addConditionMarker.closePopup();
		var location = addConditionMarker.getLatLng();
		var fname = document.getElementById("fname").value;
		var lname = document.getElementById("lname").value;
		var conditions = document.getElementById("conditions").value;
		var conditionType = document.querySelector('input[name="condition"]:checked').value;
		var markerIcon = L.icon({iconUrl: getIcon(conditionType), iconAnchor: [20,20]})
		L.marker(location, {icon: markerIcon, title: conditionType}).bindPopup(fname + " " + lname + "<br>" + conditions).addTo(map);
		map.eachLayer(function (layer) { 
			console.log(layer.options.title);
		});
	};
	
	map.on('click', (e) => {
		if (typeof(addConditionMarker)==='undefined') {
			addConditionMarker = L.marker(e.latlng,{ draggable: true});
			addConditionMarker.addTo(map);
		} else {
			addConditionMarker.setLatLng(e.latlng);
		}
		
		
		addConditionMarker.bindPopup(" <form onsubmit=\"return false;\" id=\"add-condition-form\">First name:<br><input id=\"fname\" type=\"text\" name=\"firstname\"><br>Last name:<br><input id=\"lname\" type=\"text\" name=\"lastname\"><br><br>Condition Type:<br> <input type=\"radio\" name=\"condition\" value=\"Flooding\" checked> Flooding<br><input type=\"radio\" name=\"condition\" value=\"Ice/Snow\"> Ice & Snow<br><input type=\"radio\" name=\"condition\" value=\"Damage\"> Damage<br><input type=\"radio\" name=\"condition\" value=\"Construction\"> Construction<br><input type=\"radio\" name=\"condition\" value=\"Crime\"> Crime<br><br>Conditions:<br><input id=\"conditions\" type=\"text\" name=\"conditions\"><br><br>Date:<br><input type=\"date\" name=\"date\"><br><br><input type=\"submit\" id=\"bt1\"> </form> ").openPopup();
		
		document.getElementById("add-condition-form").addEventListener('submit', functSubmit);	
	});
	*/
	

};



$(document).ready(initiateMap);
alert("Thanks for checking out this project !  I just want to let you know that this is a demo version, the information concerning campsite availability & trail conditions is NOT accurate or up to date and any updates you submit will NOT be pushed to the database.  Thank you!");