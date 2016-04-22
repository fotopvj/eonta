app.service('Maps', function() {
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

    var defaultFill = '#ffff00';
    var highlightFill = '#00ffff';

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40,
            lng: -73
        },
        styles: styleArray,
        zoom: 10
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        //Options for the parameters of each overlay shape type
        polygonOptions: {
            fillColor: defaultFill,
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: false,
            editable: true,
            zIndex: 1,
            draggable: true
        }
    });
    // adds the drawing manger to the map
    drawingManager.setMap(map);

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

            var auditionCheck = document.getElementById('audition');

            var marker;
            auditionCheck.onchange = function() {

                if (this.checked) {
                    marker = new google.maps.Marker({
                        map: map,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                } else if (marker) {
                    marker.setMap(null);
                    marker = null;
                }
            }

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

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }

    return {
        defaultFill: defaultFill,
        drawingManager: drawingManager,
        highlightFill: highlightFill,
        map: map,
        pos: pos
    };
});