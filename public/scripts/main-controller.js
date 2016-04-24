'use strict';

//for db saving
// http://stackoverflow.com/questions/32800664/google-map-api-v3-how-to-get-coordinates-of-all-shapes/32807644#32807644

app.controller('mainController', function($scope, Maps, Polygon, Uploader) {

	var currentPolygon;

	function initPolyList() {
		$scope.polygons = [];
		Polygon.list().then(function(res) {
			res.data.forEach(function(item) {
				item.polygon = Maps.addPolygon(item.coordinates);
				$scope.polygons.push(item);
			});
		});
	}

	initPolyList();

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
					currentPolygon = polygon;
					$scope.$apply();
				} else {
					$scope.deletePolygon(polygon);
				}
			}
		});
	}

	function takePolygonOffMap(polygon) {
		polygon.setMap(null);
		polygon = null;
	}

	$scope.highlight = function(poly) {
		//set the default color for all polygons
		$scope.polygons.forEach(function(item) {
			item.polygon.setOptions({
				strokeWeight: 2.0,
				fillColor: Maps.defaultFill
			});
		});
		//set the highlight color for the selected polygon
		poly.polygon.setOptions({
			strokeWeight: 2.0,
			fillColor: Maps.highlightFill
		});
	};

	$scope.deletePolygon = function(index) {
		var thisPolygon = $scope.polygons[index];
		vex.dialog.confirm({
			message: 'are you sure you want to delete' + thisPolygon.filename + '?',
			callback: function(val) {
				if (val) {
					Polygon.remove(thisPolygon._id).then(function() {
						$scope.polygons.splice(index, 1);
					});

					takePolygonOffMap(thisPolygon.polygon);
				}
			}
		});
	};

	function addPolygon(polygon, filename) {
		var coordinates = Maps.getCoordinates(polygon);

		var newPolygon = {
			filename: filename,
			coordinates: coordinates,
			url: Uploader.makeUrl(filename)
		};

		Polygon.create(newPolygon).then(function(res) {
			var newerPolygon = res.data;
			newerPolygon.polygon = polygon;
			$scope.polygons.push(newerPolygon);
			$scope.highlight(newerPolygon);
		});
	}

	$scope.upload = function() {
		var file = document.getElementById('upload').files[0];
		if (!file) {
			console.error('No file uploaded!');
			takePolygonOffMap(currentPolygon);
			$scope.loading = false;
		} else if (file.type !== 'audio/mp3' && file.type !== 'audio/ogg') {
			vex.dialog.alert('Wrong file type!');
			$scope.loading = false;
			takePolygonOffMap(currentPolygon);
		} else {
			Uploader.sign_request(file, function(response) {
				Uploader.upload(file, response.signed_request, response.url, function() {
					$scope.loading = false;
					addPolygon(currentPolygon, file.name);
					vex.dialog.alert('upload complete!');
				});
			});

		}
	};

});