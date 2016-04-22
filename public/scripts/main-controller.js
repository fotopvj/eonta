'use strict';

	//for db saving
	// http://stackoverflow.com/questions/32800664/google-map-api-v3-how-to-get-coordinates-of-all-shapes/32807644#32807644

	app.controller('mainController', function($scope, Maps, Uploader) {

		$scope.polygons = {};

		$scope.selectPolygon = function(polygon) {
			console.log(polygon);
		};

		google.maps.event.addListener(Maps.map, 'click', function(e) {
			Object.keys($scope.polygons).forEach(function(polyKey) {
				var shape = $scope.polygons[polyKey];
				var res = google.maps.geometry.poly.containsLocation(e.latLng, shape.polygon);

				/*

					play your audio here !!!!

				*/

			});
		});
		google.maps.event.addListener(Maps.drawingManager, 'polygoncomplete', function(polygon) {
			updatePolygons(Maps.pos, polygon);
		});

		function updatePolygons(latlong, polygon) {
			vex.dialog.confirm({
				message: 'do you want to upload an audio file for this location?',
				callback: function(val) {
					if (val) {
						$scope.loading = true;
						$('#upload').click();
						$scope.currentPolygon = polygon;
						$scope.$apply();
					} else {
						$scope.deletePolygon(polygon);
					}
				}
			});
		}

		$scope.highlight = function(poly) {
			//set the default color for all polygons
			Object.keys($scope.polygons).forEach(function(item) {
				$scope.polygons[item].polygon.setOptions({strokeWeight: 2.0, fillColor: Maps.defaultFill});
			});
			//set the highlight color for the selected polygon
			poly.polygon.setOptions({strokeWeight: 2.0, fillColor: Maps.highlightFill});
		};

		$scope.deletePolygon = function(polygon) {
			if (polygon.filename) {
				delete $scope.polygons[polygon.filename];
				polygon = polygon.polygon;	
			}
			polygon.setMap(null);
			polygon = null;
		};

		function addPolyGon(polygon, filename) {
			var newPolygon = {
				filename: filename,
				polygon: polygon
			};

			$scope.polygons[filename] = newPolygon;
			$scope.highlight(newPolygon);
			$scope.$apply();
		}

		$scope.upload = function() {
			var file = document.getElementById('upload').files[0];
			if (!file) {
				console.error('No file uploaded!');
				$scope.deletePolygon($scope.currentPolygon);
				$scope.loading = false;
			} else if (file.type !== 'audio/mp3' && file.type !== 'audio/ogg') {
				vex.dialog.alert('Wrong file type!');
				$scope.loading = false;
				$scope.deletePolygon($scope.currentPolygon);
			} else {
				Uploader.sign_request(file, function(response) {
					Uploader.upload(file, response.signed_request, response.url, function() {
						$scope.loading = false;
						addPolyGon($scope.currentPolygon, file.name);
						vex.dialog.alert('upload complete!');
					});
				});

			}
		};

	});