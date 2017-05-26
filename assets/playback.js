$(function() {
	//helper function
	var yx = L.latLng;
	var xy = function(x, y) {
		if (L.Util.isArray(x)) {    // When doing xy([x, y]);
			return yx(x[1], x[0]);
		}
		return yx(y, x);  // When doing xy(x, y);
	};


 	// Main

 	// Create Map Object
	var map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: -3
	});

	// Setup Map
	setupMap(map);


	// Colors for AwesomeMarkers
    var _colorIdx = 0,
        _colors = [
          'orange',
          'green',
          'orange',
          'green',
          'blue',
          'purple',
          'darkred',
          'cadetblue',
          'red',
          'darkgreen',
          'darkblue',
          'darkpurple'
        ];
        
    function _assignColor() {
        return _colors[_colorIdx++%10];
    }

    var _iconIdx = 0,
        _icons = [
            'user',
            'dollar',
            'user',
            'dollar',
            'user',
            'dollar'
        ]
    function _assignIcon() {
        return _icons[_iconIdx++%10];
    }

	// Test Coords (DEBUG)
	//drawTestCoords(map);

	// Set Map View?
	//map.setView(xy(120, 70), 1);
	map.setView(xy(-3.5, 7), 5);

/*	// Misc
	//var travel = L.polyline([sol, deneb]).addTo(map);

	// Playback Leaflet options & setup
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        sliderControl: true,
        tracksLayer: true     
    };
        
    // Initialize playback
    var playback = new L.Playback(map, teas031217, null, playbackOptions);   */


   // =====================================================
    // =============== Playback ============================
    // =====================================================

    // Playback options
    var playbackOptions = {     
    	tickLen: 500,
    	
        //todo, changes marker color
        staleTime: 5*60*1000, // 5 minutes
    	fadeMarkersWhenStale: true, //hide marker when stale


        // layer and marker options
        layer: {
            pointToLayer : function(featureData, latlng){
				//if featureData.hasAttribute("salesInfo"){ return; }

                var idx = -1
                for(var i = 0; i < featureData.geometry.coordinates.length; i++) {
                    if(featureData.geometry.coordinates[i][0] == latlng.lng &&  featureData.geometry.coordinates[i][1] == latlng.lat){
                        idx = i;
                        break;
                    }
                }
                var newDate = new Date(featureData.properties.time[idx])
                var dateString = newDate.toLocaleString();

                return new L.CircleMarker(latlng, { radius : 5 }).bindPopup(dateString);
            }
        },
        
        marker: function(featureData, latlng){
            var color = _assignColor();
            var icon = _assignIcon();
            
            return {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: icon, //bullseye, male, map-pin, star, bullseye, shopping-basket, user
                    markerColor: color
                })

            };
        },

        mouseOverCallback: function(event){
        	if (this.feature.properties.hasOwnProperty("salesInfo")){
        		//todo
                //somehow figure out the sales event object

        		event.target.bindPopup(event.latlng.toString()).openPopup();
        	} else {
        		event.target.bindPopup(event.latlng.toString()).openPopup();
        	}
        }


    };
    
    //Setup DataSet
    //var dataSet = teas031217; // tracks only
    //var dataSet = [teas031217,pos031217];
    var dataSet = [teas031217,posSample]; //sample data set

    // Initialize playback
    var playback = new L.Playback(map, dataSet, null, playbackOptions);
    
    // Initialize custom control
    var control = new L.Playback.Control(playback);
    control.addTo(map);
    
    // Add data
    playback.addData(dataSet);

	// Functions

	function setupMap(map){
		// Setup Map view and Control
	    var imgFileName = 'assets/Adiagos-OrchardMall.png';
	    var imgFilePixelSizeX = 361; //px
	    var imgFilePixelSizeY = 709; //px
	    
	    //339 px x 689 px as compared to 14.173 m x  7.214m (46'6" x 23'8") or tom notes are - 37'6" x 25'6"
		var mapUnitPixelSizeX = 50.041585805378431; //46.99196;
	    var mapUnitPixelSizeY = 50.024694842305793; //98.28112;

	    var OrginX = -361 // px
	    var OrginY = 0 // px

		var mapX = imgFilePixelSizeX/mapUnitPixelSizeX + OrginX/mapUnitPixelSizeX
		var mapY = imgFilePixelSizeY/mapUnitPixelSizeY + OrginY/mapUnitPixelSizeY

		var bounds = [xy(OrginX/mapUnitPixelSizeX, OrginY/mapUnitPixelSizeY), xy(mapX, mapY)];
		var image = L.imageOverlay(imgFileName, bounds).addTo(map); // image size is: 1544 × 1841 pixels.

	}

       
});