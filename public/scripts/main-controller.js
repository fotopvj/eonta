'use strict';


	app.controller('mainController', function($rootScope, $scope, Maps, Uploader) {

		$scope.polygons = {};

		$scope.selectPolygon = function(polygon) {
			console.log(polygon);
		};

		google.maps.event.addListener(map, 'click', function(e) {
			$scope.polygons.forEach(function(shape) {
				var res = google.maps.geometry.poly.containsLocation(e.latLng, shape);
				console.log('checks shape', res);
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