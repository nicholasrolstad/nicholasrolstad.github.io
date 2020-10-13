
//
// initiate map
//

var map = L.map('map', {zoomControl: false}).setView([39.0174, -113.4727], 9),
  layer = L.esri.tiledMapLayer({url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer',maxZoom: 15}).addTo(map),
  // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
  layerLabels = null;

function setBasemap(basemap) {
  if (layer) {
	map.removeLayer(layer);
  }
  if (basemap === 'WHS') {
	layer = L.esri.tiledMapLayer({url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer',maxZoom: 15});
  }
  else {
	layer = L.esri.basemapLayer(basemap);
  }
  map.addLayer(layer);
  if (layerLabels) {
	map.removeLayer(layerLabels);
  }
  if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'Gray' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
	layerLabels = L.esri.basemapLayer(basemap + 'Labels');
	map.addLayer(layerLabels);
  }
}

L.control.zoom({
  position:'topright'
}).addTo(map);


//
// style functions
//


function highlightUnit(e) {
    var layer = e.target;
	layer.bringToFront()
	
	if (map.hasLayer(faults)) {
		faults.bringToFront();
	}
	
	if (map.hasLayer(cs)) {
		cs.bringToFront();
	}

    layer.setStyle({
        weight: 1,
		color: 'black',
		fillColor: '#' + layer.feature.properties.HEX,
        dashArray: '',
		strokeOpacity:.55,
        fillOpacity: 1
    });

}

function resetUnit(e) {
    units.resetStyle(e.target);
}

//unit symbol pop-up
var symbPopUp;
function unitPopUp(feature, layer) {
    layer.on({
        mouseover: highlightUnit,
        mouseout: resetUnit,
    });
    if (feature.properties && feature.properties.UNITSYMBOL) {
        symbPopUp = feature.properties.UNITSYMBOL
        layer.bindPopup("<img src=\'images/"+ symbPopUp +".jpg\'> <br>View In Isolation?", {
            className: "symbPop"
        });
    }
}


function faultStyle(feature) {
	if (feature.properties.MODIFIER === 'well located') {
		return {color: 'black', weight: .5, dashArray: ''};
	} else if (feature.properties.MODIFIER === 'concealed') {
		return {color: 'black', weight: .5, dashArray: '1,3'};
	} else if (feature.properties.MODIFIER === 'approximately located') {
		return {color: 'black', weight: .5, dashArray: '5,1'};
	}
}


//
// feature layers
//


var units = L.esri.featureLayer({
		url:'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/ArcGIS/rest/services/wahwah_tule_gdb_view/FeatureServer/0',
		style: function(feature) {
			return {
				color: '#' + feature.properties.HEX, 
				opacity: 1,
        		fillOpacity: .8,
        		weight: .5
			};
		},
		onEachFeature: unitPopUp
	});


var boundary = L.esri.featureLayer({
		url:'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/ArcGIS/rest/services/wahwah_tule_gdb_view/FeatureServer/3',
		style: {
			color: '#333333',
			fillOpacity: 0,
			dashArray: '5,2,2',
			weight: .5
		}
	});


var faults = L.esri.featureLayer({
		url:'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/ArcGIS/rest/services/wahwah_tule_gdb_view/FeatureServer/2',
		style: faultStyle
	});

var cs = L.esri.featureLayer({
		url:'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/ArcGIS/rest/services/wahwah_tule_gdb_view/FeatureServer/1',
		style: {
			color: '#111111',
			weight: 2,
			lineCap: 'round'
		}
	});


//
// initiate layers
//

units.addTo(map);
faults.addTo(map);
boundary.addTo(map);
boundary.bringToBack();
faults.bringToFront();


//
// jQuery listeners
//

$(document).ready(function(){
	$("#selectStandardBasemap").on("change", function(e) {
		setBasemap($(this).val());
  	});
	
	
	$('#units-btn').click(function () {
			$('#units-btn').toggleClass('btn-primary');
			$('#units-btn').toggleClass('btn-secondary');
			if (map.hasLayer(units)) {
				map.removeLayer(units);
			} else {
				units.addTo(map);
				if (map.hasLayer(faults)) {
					faults.bringToFront();
				}
				if (map.hasLayer(cs)) {
					cs.bringToFront();
				}
				
			}
		});
	
	$('#faults-btn').click(function () {
			$('#faults-btn').toggleClass('btn-primary');
			$('#faults-btn').toggleClass('btn-secondary');
			if (map.hasLayer(faults)) {
				map.removeLayer(faults);
			} else {
				faults.addTo(map);
			}
			
		});
	
	$('#cs-btn').click(function () {
			$('#cs-btn').toggleClass('btn-primary');
			$('#cs-btn').toggleClass('btn-secondary');
			if (map.hasLayer(cs)) {
				map.removeLayer(cs);
			} else {
				cs.addTo(map);
			}
		});
});

