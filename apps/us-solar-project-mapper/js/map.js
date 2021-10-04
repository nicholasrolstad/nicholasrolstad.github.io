$(document).ready(function(){
// initiate variables
var xcel = null;
var loading_animation = "<div class=\"lds-spinner\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>"
var points_eligible
const btn_classes = ['.substations-btn', '.solar-projects-btn', '.distribution-lines-btn', '.service-territory-btn']

// ajax callbacks to load data
function ajaxCallBackCo(retString){
	mn_counties = retString; //mn counties json
}

$.ajax({
dataType: "json",
url: "js/mn_counties_ltd.json",
success: function(data) {
		ajaxCallBackCo(data);
}
}).error(function() { console.log('error')});


var map = L.map('map', {zoomControl: false}).setView([40.03, -93.3], 5),
	layer = L.esri.basemapLayer("Gray").addTo(map);
	//layerLabels = L.esri.basemapLayer('GrayLabels').addTo(map);
	layerLabels = null;

	
function setBasemap(basemap) {
	if (layer) {
		map.removeLayer(layer);
	}
	if (basemap === 'WHS') {
		L.esri.basemapLayer("Gray").addTo(map);
	}
	else {
		layer = L.esri.basemapLayer(basemap);
	}
	map.addLayer(layer);
	if (layerLabels) {
		map.removeLayer(layerLabels);
	}
	if (basemap === 'ShadedRelief' || basemap === 'Oceans' || basemap === 'DarkGray' || basemap === 'Imagery' || basemap === 'Terrain') {
		layerLabels = L.esri.basemapLayer(basemap + 'Labels');
		map.addLayer(layerLabels);
	}
}

L.control.zoom({
	position:'topright'
}).addTo(map);


//
// auth functions
//

const submitBtn = document.getElementById('formSubmit');
let token;

	
// add event listener to form
submitBtn.addEventListener('click', addServicesFromServer);

const tokenUrl = 'https://www.arcgis.com/sharing/rest/generateToken';
	
// function to make request to server
function serverAuth (server, username, password, callback) {
  L.esri.post(server, {
    username: username,
    password: password,
    f: 'json',
    expiration: 86400,
    client: 'referer',
    referer: window.location.origin
  }, callback);
}

// function to run when form submitted
function addServicesFromServer (e) {
  // prevent page from refreshing
  e.preventDefault();

  // get values from form
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
	
  // generate token from server and add service from callback function
  serverAuth(tokenUrl, username, password, function (error, response) {
    if (error) {
			console.log(error)
			$('.log-in-status').addClass('alert alert-danger');
			if ($( ".log-in-status" ).hasClass( "alert-success" )) {
				$('.log-in-status').removeClass('alert-success');
			}
			$('.log-in-status span').text('Log-in Failed');
      return;
    }
    // add layer to map
		console.log('log-in successful')
		$('.log-in-status').addClass('alert alert-success');
		if ($( ".log-in-status" ).hasClass( "alert-danger" )) {
				$('.log-in-status').removeClass('alert-danger');
			}
		$('.log-in-status span').text('Log-in Successful');
		token = response.token
  }); // end serverAuth call
} // end addServicesFromServer call
	
	
function resetBtns (btn_class) {
	if ($(btn_class).hasClass('btn-secondary')) {
		console.log();
	} else {
		console.log();
		$(btn_class).removeClass('btn-info');
		$(btn_class).addClass('btn-secondary');
	}
}

function removeAllLayers () {
	try {
		map.removeLayer(service_territory);
	}
	catch {
		console.log();
	}

	try {
		map.removeLayer(distribution);
	}
	catch {
		console.log();
	}

	try {
		map.removeLayer(projects);
	}
	catch {
		console.log();
	}
	try {
		map.removeLayer(substations);
	}
	catch {
		console.log();
	}
}
	
//token = "WGC2LnJ7ItVirMxXF4u6yE0RC19FFX75Tc9-miYlGx82a5dtNUrt0Vg04jxGMTXUSpPG9AQD0LmRwXmDaxv3qPnKwZBhWzQxryTi5jv2DkCD4LyCXbnSOfgp6DrT2_8m3kFaNj8Z8r5T-bV7YcrSpedb1R1ou6VolzYMOoTQSDZ4dE2UIBLIV85mviu9nT-o"
	

function projectColor(c) {
	switch(c) {
		case 'Lost':
			return "#D6280D"
			break;
		case 'Won':
			return "#267E1F"
			break;
		case 'Open':
			return "#FDE036"
			break;
		default:
			return "#B9B9B9"
	}
}




function highlightUnit(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
				opacity: .9,
				fillOpacity: .9,
				color: '#83A360',
				fill: '#83A360',
    });

}



//
// feature layers
//

var substation_icon = L.icon({
	iconUrl: 'img/substations.svg',
	iconSize: [30,30]
})

var point_icon_grey = L.icon({
	iconUrl: 'img/icon-greyed.svg',
	iconSize: [30,30]
})

var points = L.esri.featureLayer({
		url: 'https://services5.arcgis.com/V5xqUDxoOJurLR4H/ArcGIS/rest/services/MN_Substations/FeatureServer/0?token=xPvBROYyxm8OA7aNsNFBJzBbglsZem60_uMgV9VDqrPipVincZExeHJjMV26K2DgOa2ZcnPJDCu-BiQLoTGQu0vDyMFDyH2O-9Hw4_CPnidDkqAr_F_n3dwSMMQT-TgcsRV8JBxFrPCNEQtWP5SwW3wRgcrx-URIhqtTduUyGGQHqBWbUMhJplJXoW1C-Iurg6xATmjMeaAsPkg8AudTexjTm5nxYyldIP_9McwILZwj-vZU_fSkx68wste5yvWr6UzzHJIUZkzN6Q1E08H9mA..',
		pointToLayer: function (geojson, latlng) {
			return L.marker(latlng, {
				icon: point_icon
			});
		},
	});

var points_operating = L.esri.featureLayer({
		where: "operating_status = 1",
		url: 'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/arcgis/rest/services/projects_view/FeatureServer/0',
		pointToLayer: function (geojson, latlng) {
			return L.marker(latlng, {
				icon: point_icon
			});
		},
				onEachFeature: function(feature, layer) {
						layer.bindPopup(feature.properties.name);
						if (feature.properties.operating_status == 1) {
							imageLink = "img/" + feature.properties.name.toLowerCase().replace(/ /g, "").replace("solar", "").replace(".", "").replace("uss", "") + ".jpg"
        			layer.bindPopup("<span class=\"popup-title\">" + feature.properties.name + "</span>" + "<br><br><img src=" + imageLink + ">" + "<br><br>" + feature.properties.county + " County  |  In-Operation", {minWidth: 300});
						} else {
							layer.bindPopup(feature.properties.name);
						}
				}
	});
	
var points_future = L.esri.featureLayer({
		where: "operating_status = 0",
		url: 'https://services9.arcgis.com/YEQ7YfprtcM3j3JL/arcgis/rest/services/projects_view/FeatureServer/0',
		pointToLayer: function (geojson, latlng) {
			return L.marker(latlng, {
				icon: point_icon
			});
		},
				onEachFeature: function(feature, layer) {
						layer.bindPopup(feature.properties.name);
						if (feature.properties.operating_status == 0) {
							imageLink = "img/" + feature.properties.name.toLowerCase().replace(/ /g, "").replace("solar", "").replace(".", "").replace("uss", "") + ".jpg"
        			layer.bindPopup("<span class=\"popup-title\">" + feature.properties.name + "</span>" + "<br><br><img src=" + imageLink + ">" + "<br><br>" + feature.properties.county + " County  |  In-Construction", {minWidth: 300});
						} else {
							layer.bindPopup(feature.properties.name);
						}
				}
	});

var points_eligible;
var operating_id = String(points_operating._leaflet_id)
var future_id = String(points_future._leaflet_id)
var results_id;
var ids = [operating_id, future_id]

//
// initiate layers
//

//points.addTo(map);
//map.removeLayer(points);
points_operating.addTo(map);
points_future.addTo(map);


map.on('mousedown', function(e) {
	if ( $('#collapseBasemaps').hasClass("in")) {
		$('#collapseBasemaps').removeClass('in');
	}
});

map.on('popupopen', function(e) {
	var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
	px.y -= e.popup._container.clientHeight/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
	//map.panTo(map.unproject(px),{animate: true}); // pan to new center
});






	//
	// jQuery listeners, think about replacing these with vanilla JS code
	//


		$("#selectStandardBasemap").on("change", function(e) {
				setBasemap($(this).val());
			});


		$('.service-territory-btn').click(function () {
			// workaround to remove results layer
			/*
			map.eachLayer(function (layer) {
					if (String(layer._leaflet_id) == results_id) {
						map.removeLayer(layer);
					}
			});		
			*/

			$('.service-territory-btn').toggleClass('btn-info');
			$('.service-territory-btn').toggleClass('btn-secondary');
			
			if (map.hasLayer(service_territory)) {
				map.removeLayer(service_territory);
			} else {
				service_territory.addTo(map);
			}
			/*
			if (map.hasLayer(points_future)) {
				map.removeLayer(points_future);
			} else {
				points_future.addTo(map);
			}
			*/
		});
	
		$('.distribution-lines-btn').click(function () {
			// workaround to remove results layer
			/*
			map.eachLayer(function (layer) {
					if (String(layer._leaflet_id) == results_id) {
						map.removeLayer(layer);
					}
			});		
			*/

			$('.distribution-lines-btn').toggleClass('btn-info');
			$('.distribution-lines-btn').toggleClass('btn-secondary');
			
			if (map.hasLayer(distribution)) {
				map.removeLayer(distribution);
			} else {
				distribution.addTo(map);
			}
			/*
			if (map.hasLayer(points_future)) {
				map.removeLayer(points_future);
			} else {
				points_future.addTo(map);
			}
			*/
		});
	
	
	
		$('.substations-btn').click(function () {
			// workaround to remove results layer
			/*
			map.eachLayer(function (layer) {
					if (String(layer._leaflet_id) == results_id) {
						map.removeLayer(layer);
					}
			});		
			*/

			$('.substations-btn').toggleClass('btn-info');
			$('.substations-btn').toggleClass('btn-secondary');
			
			if (map.hasLayer(substations)) {
				map.removeLayer(substations);
			} else {
				substations.addTo(map);
			}
			
		});
	
	
		$('.solar-projects-btn').click(function () {
			// workaround to remove results layer
			/*
			map.eachLayer(function (layer) {
					if (String(layer._leaflet_id) == results_id) {
						map.removeLayer(layer);
					}
			});		
			*/

			$('.solar-projects-btn').toggleClass('btn-info');
			$('.solar-projects-btn').toggleClass('btn-secondary');
			
			if (map.hasLayer(projects)) {
				map.removeLayer(projects);
			} else {
				projects.addTo(map);
			}
			/*
			if (map.hasLayer(points_future)) {
				map.removeLayer(points_future);
			} else {
				points_future.addTo(map);
			}
			*/
		});
	
		$('.layer-view').click(function () {
				// workaround to remove results layer
				/*
				map.eachLayer(function (layer) {
						if (String(layer._leaflet_id) == results_id) {
							map.removeLayer(layer);
						}
				});		
				*/

				$('.panel-body').toggleClass('collapse');
				$('.layer-view').toggleClass('esri-icon-minimize');
			  $('.layer-view').toggleClass('esri-icon-maximize');
				/*
				if (map.hasLayer(points_future)) {
					map.removeLayer(points_future);
				} else {
					points_future.addTo(map);
				}
				*/
			});
	
		$('.panel-toggle').click(function () {
				// workaround to remove results layer
				/*
				map.eachLayer(function (layer) {
						if (String(layer._leaflet_id) == results_id) {
							map.removeLayer(layer);
						}
				});		
				*/

				$('.panel-body').toggleClass('collapse');
				$('.layer-view').toggleClass('esri-icon-minimize');
			  $('.layer-view').toggleClass('esri-icon-maximize');
				/*
				if (map.hasLayer(points_future)) {
					map.removeLayer(points_future);
				} else {
					points_future.addTo(map);
				}
				*/
			});

	
	  /*  MARKET SELECTION LISTENERS  */
		$('#itemCO').click(function () {
			// workaround to remove results layer
			map.setView([39.0, -105.4], 7)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemCT').click(function () {
			// workaround to remove results layer
			map.setView([41.6, -72.6], 9)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemDE').click(function () {
			// workaround to remove results layer
			map.setView([39.1, -75.5], 9)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemME').click(function () {
			// workaround to remove results layer
			map.setView([45.6, -69.1], 7)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemMN').click(function () {
			// workaround to remove results layer
			map.setView([46.3, -93.6], 7);
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
			
			substations = L.esri.Cluster.featureLayer({
    		url: 'https://services5.arcgis.com/V5xqUDxoOJurLR4H/ArcGIS/rest/services/MN_Substations/FeatureServer/0',
				opacity: 1,
				token: token,
				pointToLayer: function (geojson, latlng) {
					return L.marker(latlng, {
						icon: substation_icon
					});
				},
				onEachFeature: function(feature, layer) {
						layer.bindPopup(L.Util.template('<p class="popup-title">{Name} Substation</p><p class="">Utility: {UTILITY}<br>Hosting Capacity: {HostingCapacity}</p>', layer.feature.properties));
				},
				disableClusteringAtZoom: 12,
				// this function defines how the icons
				// representing clusters are created
				iconCreateFunction: function (cluster) {
					// get the number of items in the cluster
					var count = cluster.getChildCount();

					// figure out how many digits long the number is
					var digits = (count + '').length;

					// Return a new L.DivIcon with our classes so we can
					// style them with CSS. Take a look at the CSS in
					// the <head> to see these styles. You have to set
					// iconSize to null if you want to use CSS to set the
					// width and height.
					return L.divIcon({
						html: count,
						className: 'cluster digits-' + digits,
						iconSize: null
      		});
  			}
			})
		

			distribution = L.esri.featureLayer({
					url: 'https://services5.arcgis.com/V5xqUDxoOJurLR4H/arcgis/rest/services/MN_Distribution_Lines/FeatureServer/0',
					opacity: 1,
					token: token,
					style: function (feature) {
						return 	{weight: 2, opacity: 1, color: feature.properties.HEX}
					},
					onEachFeature: function(feature, layer) {
							layer.bindPopup(L.Util.template('<p class="popup-title">3-Phase Distribution</p><p class="">Utility: {Utility}<br>Substation: {Substation}<br>Feeder: {Feeder}<br>Feeder Voltage: {FeederVoltagekV}</p>', layer.feature.properties));
							layer.setStyle({color:feature.properties.HEX});
							//console.log(feature.properties);
					}
				})

			projects = L.esri.featureLayer({
					url: 'https://services5.arcgis.com/V5xqUDxoOJurLR4H/arcgis/rest/services/MN_USS_Sites/FeatureServer/0',
					style: function (feature) {
							return 	{weight: 1, opacity: 1, fillOpacity: .55, color: projectColor(feature.properties.Status)}
						},
					token: token,
					onEachFeature: function(feature, layer) {
								layer.bindPopup(L.Util.template('<p class="popup-title">{Deal_Name}</p><p class="">Program: {Program}<br>Substation: {Substation}<br>Status: {Status}<br>Stage: {Stage}</p>', layer.feature.properties));
								//layer.setStyle({color:feature.properties.HEX});
								console.log(feature.properties);
						}
				})

			service_territory = L.esri.featureLayer({
					url: 'https://services5.arcgis.com/V5xqUDxoOJurLR4H/ArcGIS/rest/services/MN_ServiceAreas/FeatureServer/0',
				  where: "mpuc_name IN ('Xcel Energy', 'Minnesota Power Co')",
					opacity: 1,
					token: token,
					style: function () {
						return {
							weight: 1,
							opacity: .5,
							fillOpacity: .5,
							color: '#83A360',
							fill: '#83A360',
						}
					},
					onEachFeature: function(feature, layer) {
							layer.bindPopup(feature.properties.mpuc_name);
						  //console.log(feature.properties);
							layer.on('click', function() {
								this.setStyle({
										weight: 1,
										opacity: .9,
										fillOpacity: .9,
										color: '#83A360',
										fill: '#83A360',
								});
							}),
							layer.on('mouseout', function () {
									service_territory.resetStyle(this);
							});
					}
				})
			});

	
		$('#itemNJ').click(function () {
			// workaround to remove results layer
			map.setView([40.2, -74.5], 8)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemNM').click(function () {
			// workaround to remove results layer
			map.setView([34.7, -106.0], 7)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});

		$('#itemNY').click(function () {
			// workaround to remove results layer
			map.setView([42.9, -75.4], 7)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
		$('#itemPA').click(function () {
			// workaround to remove results layer
			map.setView([40.8, -77.5], 8)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
	
		$('#itemVA').click(function () {
			// workaround to remove results layer
			map.setView([37.8, -78.9], 8)
			btn_classes.forEach(element => resetBtns(element));
			removeAllLayers();
		});
	
	

		$('#future-btn').click(function () {
				// workaround to remove results layer
			  map.eachLayer(function (layer) {
						if (String(layer._leaflet_id) == results_id) {
							map.removeLayer(layer);
						}
				});			
			
				$('#future-btn').toggleClass('btn-info');
				$('#future-btn').toggleClass('btn-secondary');
			 	
				if (map.hasLayer(points_future)) {
					map.removeLayer(points_future);
				} else {
					points_future.addTo(map);
				}
			});




		// Search
				var input = $(".geocoder-control-input");
				input.focus(function(){
					$("#panelSearch .panel-body").css("height", "auto");
				});
				input.blur(function(){
					 $("#panelSearch .panel-body").css("height", "auto");
				});
				// Attach search control for desktop or mobile
				function attachSearch() {
					var parentName = $(".geocoder-control").parent().attr("id"),
						geocoder = $(".geocoder-control"),
						width = $(window).width();
						$("#geocode").append(geocoder);
				}
				attachSearch();
});

