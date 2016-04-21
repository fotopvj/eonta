'use strict';

app.controller('mainController', function($scope, Uploader) {

	$scope.upload = function() {
        var file = document.getElementById('upload').files[0];
        if (!file) {
        	console.error('No file uploaded!');
        	return
        } else if (file.type !== 'audio/mp3' && file.type !== 'audio/ogg') {
        	console.error('Wrong file type!')	
        	return;
        }

        Uploader.sign_request(file, function(response) {
            Uploader.upload(file, response.signed_request, response.url, function() {
            	console.log('upload complete', file);
            });
        });
    }

	// The map initiation, decides the center and the level of initial zoom 
	window.initMap = function initMap() {

		// styling for the look of the map
		var styleArray = [{
			featureType: 'all',
			stylers: [{
				saturation: -100
			}]
		}, {
			featureType: 'road.arterial',
			elementType: 'geometry',
			stylers: [{
				hue: '#ffc749'
			}, {
				saturation: 700
			}]
		}, {
			featureType: 'poi.business',
			elementType: 'labels',
			stylers: [{
				visibility: 'off'
			}]
		}];

		var map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 40,
				lng: -73
			},
			styles: styleArray,
			zoom: 10
		});

		var drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: [
					google.maps.drawing.OverlayType.CIRCLE,
					google.maps.drawing.OverlayType.POLYGON
				]
			},

			//Options for the parameters of each overlay shape type
			circleOptions: {
				fillColor: '#ffff00',
				fillOpacity: 0.5,
				strokeWeight: 2,
				clickable: false,
				editable: true,
				zIndex: 1,
				draggable: true
			},
			polygonOptions: {
				fillColor: '#ffff00',
				fillOpacity: 0.5,
				strokeWeight: 2,
				clickable: false,
				editable: true,
				zIndex: 1,
				draggable: true
			},
			//  polylineOptions: {
			//   fillColor: '#ffff00',
			//   fillOpacity: .5,
			//   strokeWeight: 2,
			//   clickable: false,
			//   editable: true,
			//   zIndex: 1,
			//   draggable: true     
			// },
			//  rectangleOptions: {
			//   fillColor: '#ffff00',
			//   fillOpacity: .5,
			//   strokeWeight: 2,
			//   clickable: false,
			//   editable: true,
			//   zIndex: 1,
			//   draggable: true
			// }

		});
		// adds the drawing manger to the map
		drawingManager.setMap(map);

		$scope.polygons = [];

		google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
			updatePolygons(pos, polygon);
		});


		// shows the circle has been made, gives the same radius  
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
			console.log(event);

			// shows the polygon has been made, gives the same radius   
			// else if (event.type == google.maps.drawing.OverlayType.POLYGON) {

			// find the area of the polygon.
			// console.log('the event of the polygon is ', this, event);
			// }

		});

		function updatePolygons(latlong, polygon) {
			$scope.polygons.push(polygon);
			$scope.$apply();
		}

		google.maps.event.addListener(map, 'click', function(e) {
			$scope.polygons.forEach(function(shape) {
				var res = google.maps.geometry.poly.containsLocation(e.latLng, shape);
				console.log('checks shape', res);
			});
		});

		var pos;
		// create an info window to initiate user position.  
		var infoWindow = new google.maps.InfoWindow({
			map: map
		});

		// finds the users initial coordinates and repositions the map to center around the user.  
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				infoWindow.setPosition(pos);
				infoWindow.setContent('Location found.');


<<<<<<< HEAD
				var auditionCheck = document.getElementById('audition');

				auditionCheck.onchange= function() {
					if(this.checked) {marker = new google.maps.Marker({
                        map: map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: {lat: position.coords.latitude, lng: position.coords.longitude}});        
                    }
				}
                
=======
				var coordinateClick = document.getElementById('coordinate');

				coordinateClick.onclick = function() {
					alert('Your latitude is: ' + position.coords.latitude + ', your longitude is: ' + position.coords.longitude);
				};
>>>>>>> 3724101338306e410985462dca10e9d4635ea99e

				// reposition map to the user's position.
				map.setCenter(pos);

				// zoom onto the user
				map.setZoom(16);

				// console.log('your initial position is latitude:' + position.coords.latitude + ', longitude: ' + position.coords.longitude);
			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow, map.getCenter());
		}
	};

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
	}

});