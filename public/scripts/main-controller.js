app.controller('mainController', function($scope, Audio, Maps, Polygon, Uploader) {
	'use strict';

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
		$scope.polygons.forEach(function(polygon) {
			var inBounds = google.maps.geometry.poly.containsLocation(e.latLng, polygon.polygon);

			if (inBounds && !polygon.currentlyPlaying) {
				polygon.currentlyPlaying = Audio.play(polygon.url);
			} else if (!inBounds && polygon.currentlyPlaying) {
				polygon.currentlyPlaying();
				delete polygon.currentlyPlaying;
			} 
		});
		$scope.$apply();
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
					takePolygonOffMap(polygon);
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
					if ($scope.polygons[index].currentlyPlaying) $scope.polygons[index].currentlyPlaying();
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