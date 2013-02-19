(function(app) {
		var m;
		var layers = document.getElementById('layers');
		var markers;
		var features;
	    
	   mapbox.auto('map', 'nate.map-mjvvnjm5', getData) 
		
		var interaction = mapbox.interaction();
			interaction.map(map);
			
	    // Get data
	    function getData(map) {
			m = map;
			mmg_google_docs('0Agz3kF-4PjNPdHRqQldhSUNsLVpZYURucE0tUEYxclE', mapData);
		}
		
		// Build map
		function mapData(f){ 
			features = f;
			markers = mapbox.markers.layer()
				//.factory(factory)    
				.features(f);            
			mapbox.markers.interaction(markers);
			m.addLayer(markers);  
			newMarker();

		}

		function newMarker() {
    		if (window.location.hash === '#new') {
        		$('#new').fadeIn('slow');
        		window.location.hash = '';
        		window.setTimeout(function() {
            		$('#new').fadeOut('slow');
        		}, 4000)
    		}
        }

		// google_docs.js
		function mmg_google_docs(id, callback) {
		    if (typeof reqwest === 'undefined') {
		        throw 'CSV: reqwest required for mmg_csv_url';
		    }

		    function response(x) {
		        var features = [],
		            latfield = '',
		            lonfield = '';
		        if (!x || !x.feed) return features;

		        for (var f in x.feed.entry[0]) {
		            if (f.match(/\$lat/i)) latfield = f;
		            if (f.match(/\$lon/i)) lonfield = f;
		        }

		        for (var i = 0; i < x.feed.entry.length; i++) {
		            var entry = x.feed.entry[i];
		            var feature = {
		                geometry: {
		                    type: 'Point',
		                    coordinates: []
		                },
		                properties: {
							'marker-color':'#F33',
							'title': 'Last update: ' + entry['gsx$timenow'].$t,
							'description': entry['gsx$tweet'].$t
						}
		            };
		            for (var y in entry) {
		                if (y === latfield) feature.geometry.coordinates[1] = parseFloat(entry[y].$t);
		                else if (y === lonfield) feature.geometry.coordinates[0] = parseFloat(entry[y].$t);
		                else if (y.indexOf('gsx$') === 0) {
		                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
		                }
		            }
		            if (feature.geometry.coordinates.length == 2) features.push(feature);
		        }

		        return callback(features);
		    }

		    var url = 'https://spreadsheets.google.com/feeds/list/' + id +
		        '/4/public/values?alt=json-in-script&callback=callback';

		    reqwest({
		        url: url,
		        type: 'jsonp',
		        jsonpCallback: 'callback',
		        success: response,
		        error: response
		    });
		}

}({}));    

