app.controller('mainController', function($interval, $location, $scope, Audio, Maps, Polygon, Uploader) {
	'use strict';

	window.$location = $location;

	var currentPolygon;

	function initPolyList() {
		const locationArray = $location.$$absUrl.split('/')	
		const room = locationArray[locationArray.length - 1]
		$scope.polygons = [];
		Polygon.list(room).then(function(res) {
			res.data.forEach(function(item) {
				item.polygon = Maps.addPolygon(item.coordinates);
				$scope.polygons.push(item);
			});
		});
	}

	function seeWhatToPlay(latlng) {
		$scope.polygons.forEach(function(polygon) {
			var inBounds = google.maps.geometry.poly.containsLocation(latlng, polygon.polygon);

			if (inBounds && !polygon.currentlyPlaying) {
				polygon.currentlyPlaying = Audio.play(polygon.url);
			} else if (!inBounds && polygon.currentlyPlaying) {
				polygon.currentlyPlaying();
				delete polygon.currentlyPlaying;
			}
		});
	}

	initPolyList();

	function initialize() {
		$interval(function() {
			if (!$scope.auditionMode) {
				Maps.myLocation();
				var latlng = new google.maps.LatLng(Maps.pos().lat, Maps.pos().lng)
				if (!latlng) return;
				if (Maps.marker()) {
					Maps.marker().setPosition(latlng);
				} else {
					Maps.dropMarker();
				}
				seeWhatToPlay(latlng);
			}
		}, 1000);

		$scope.toggleAuditionMode = function() {
			if ($scope.auditionMode) {
				if (!Maps.marker()) Maps.dropMarker();
				google.maps.event.addListener(Maps.marker(), 'drag', function(e) {
					seeWhatToPlay(e.latLng)
					$scope.$apply();
				});
			}
		};

	}

	$scope.initialize = initialize;

	google.maps.event.addListener(Maps.drawingManager, 'polygoncomplete', function(polygon) {
		updatePolygons(Maps.pos(), polygon);
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
			message: 'are you sure you want to delete ' + thisPolygon.filename + '?',
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
		} else if (Audio.allowedType(file.type)) {
			Uploader.sign_request(file, function(response) {
				Uploader.upload(file, response.signed_request, response.url, function() {
					$scope.loading = false;
					addPolygon(currentPolygon, file.name);
					vex.dialog.alert('upload complete!');
				});
			});
		} else {
			vex.dialog.alert('Wrong file type!');
			$scope.loading = false;
			takePolygonOffMap(currentPolygon);

		}
	};

});