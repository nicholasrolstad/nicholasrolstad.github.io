// JS FOR MEDIAN 3BR RENT PROJECT - NICHOLAS ROLSTAD

//function to initiate map
function initiateMap(){
	
	//retrieve basemap layers
	var label_base = L.tileLayer('https://api.mapbox.com/styles/v1/midwestcoast/cjduh5ho03ad72sqs0i07d5c2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlkd2VzdGNvYXN0IiwiYSI6ImNpd3F6djN5ZTAxY3Yyb3BmM2Z4dzlrd2UifQ.ad4-hQvgRhK2ETritdMAYw', {id: 'MapID', attribution: '&copy; ' + '<a href="https://www.mapbox.com/">Mapbox</a>' + ' | <a href="https://www.zillow.com/research/">Zillow Research</a> |' +' <a href="https://nicholasrolstad.github.io/">Nicholas Rolstad 2018</a>'})
	
	var labelless_base = L.tileLayer('https://api.mapbox.com/styles/v1/midwestcoast/cjeeqaybd6ohg2spr5wcn78fd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlkd2VzdGNvYXN0IiwiYSI6ImNpd3F6djN5ZTAxY3Yyb3BmM2Z4dzlrd2UifQ.ad4-hQvgRhK2ETritdMAYw', {id: 'MapID', attribution: '&copy; ' + '<a href="https://www.mapbox.com/">Mapbox</a>' + ' | <a href="https://www.zillow.com/research/">Zillow Research</a> |' +' <a href="https://nicholasrolstad.github.io/">Nicholas Rolstad 2018</a>'})
	
    //create the map
	var map = L.map('map', {
		center: [39.8, -98.5],
		zoom: 5,
		minZoom: 3,
		maxZoom: 8,
		inertia: false,
		layers: labelless_base
	});

    //create basemap control layer
	var baseMaps = {"No Labels": labelless_base, "Labels": label_base};
	L.control.layers( baseMaps, null, {position: 'topleft'}).addTo(map);
	
    //call getData function
    getData(map);
};

//initial options for circle marker style
var options = {
	fillColor: "#ffffff",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.9
};


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    var attribute = attributes[0];


    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
	
	options.fillColor = getColor(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

	createPopup(feature.properties,attribute,layer,options.radius);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};


//function to update symbology
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //get feature properties
            var props = layer.feature.properties;
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
			//set new layer values for radius and fill color
            layer.setRadius(radius);
			layer.setStyle({fillColor: getColor(layer.feature.properties[attribute])});
			//update popup content
			$('.year-control-container').empty().append("<div class='rent'>" + attribute + "</div>");
			createPopup(props,attribute,layer,radius);
        };
    });
};


//function to create popups
function createPopup(properties, attribute, layer, radius){
	     //add city to popup
		var popupContent = "<p><span class='city'>"  + properties.city + "</span> </p>";

		//append rent to popup
		popupContent += "<p><span class='rent'> $" + properties[attribute] + "</p>";

		//replace the layer popup
		layer.bindPopup(popupContent, {
			offset: new L.Point(0,8)
		});
}


//function to calculate the radius of a symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 3;
    //calculate area
    var area = attValue * scaleFactor;
    //calculate radius
    var radius = Math.sqrt(area/Math.PI);
    return radius;
};


//function to get appropriate color based on graduated rent rates
function getColor(d) {
	return d < '1000' ? '#fdeeed' :
		   d >= '1000' && d < '1300' ? '#f6d6d4' :
		   d >= '1300' && d < '1600' ? '#f0bfbc' :
		   d >= '1600' && d < '1900' ? '#eaa7a3' :
		   d >= '1900' && d < '2200' ? '#e4908b' :
		   d >= '2200' && d < '2500' ? '#dd7872' :
		   d >= '2500' && d < '2800' ? '#d7615a' :
		   d >= '2800' && d < '3100' ? '#d14941' :
		   d >= '3100' && d < '3400' ? '#cb3229' :
	       d > '3400' ? '#c51b11' :
		'#FFFFFF';
}

// function to create symbology
function createPropSymbols(data, map, attributes){
    //convert geoJson points to layer
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
			return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};







//function to create the sequence controls
function createSequenceControls(map, attributes){
	//extend controls to include sequence controls
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		
		// add new div to document
		onAdd: function (map) {
			var container = L.DomUtil.create('div', 'sequence-control-container');
			// add slider and forward/reverse buttons
			$(container).append('<input class="range-slider" type="range" min="0" max="6" value="0" step="1" id="timeline">');
			$(container).append('<button class="skip" id="reverse" title="Reverse"><img src="img/backward.png"></button>');
            $(container).append('<button class="skip" id="forward" title="Forward"><img src="img/forward.png"></button>');
	        // disable map drag when using slider
            $(container).on('mousedown dblclick pointerdown', function(e){
                L.DomEvent.stopPropagation(e);
            });
			
			// update symbology on mouse click 
			$(document).on('click pointerdown', function(){

				//on click of reverse button, adjust index and update symbology
				$('#reverse').on('click', function (){
					index--;
					//Step 7: if past the first attribute, wrap around to last attribute
					index = index < 0 ? 6 : index;
					$('.range-slider').val(index);
					updatePropSymbols(map, attributes[index]);
				});
				
				//on click of forward button, adjust index and update symbology
				$('#forward').on('click', function (){
					index++;
					//Step 7: if past the last attribute, wrap around to first attribute
					index = index > 6 ? 0 : index;
					$('.range-slider').val(index);
					updatePropSymbols(map, attributes[index]);
				});
				
				//update index of slider
				var index = $('.range-slider').val();
			});
	        
			//on movement of slider, update symbology
			$(container).on('input', function(){
        		var index = $('.range-slider').val();
				updatePropSymbols(map, attributes[index]);
    		});
			return container;
		}
	})
	//add updated sequence controls
	map.addControl(new SequenceControl());
};


//function to create/update year display
function createYearLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            //create the div
            var container = L.DomUtil.create('div', 'year-control-container');
			//read index of slider
			var index = $('.range-slider').val();
			//adjust year based on index
			$(container).append("<div id='top' class='rent'>" + attributes[index] + "</div>")
			
            return container;
        }
    })
    //add legend to map
    map.addControl(new LegendControl());
};


// function to process geojson data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes that contain '20' since all year values in set are between 2011-2017
        if (attribute.indexOf("20") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};


//function to retrieve the data and place it on the map
function getData(map){
    //load the geojson
	$.ajax("data/medianrent.geojson", {
			dataType: "json",
			success: function(response){
				//create an array of attributes
            	var attributes = processData(response);
				
				//add symbols
				createPropSymbols(response, map, attributes);
				//add sequence controls
				createSequenceControls(map, attributes);
				//add year display
				createYearLegend(map,attributes);
        }
    });
};


$(document).ready(initiateMap);