'use strict';


// The map initiation, decides the center and the level of initial zoom 
function initMap() {
   
// styling for the look of the map
    var styleArray = [
    {
      featureType: "all",
      stylers: [
       { saturation: -100 }
      ]
    },{
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        { hue: "#ffc749" },
        { saturation: 700 }
      ]
    },{
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
   
   var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40, lng: -73},
          styles: styleArray,
          zoom: 10
    });
    
var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    
//Options for the parameters of each overlay shape type
    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: .5,
      strokeWeight: 2,
      clickable: false,
      editable: true,   
      zIndex: 1,
      draggable: true 
    },
      polygonOptions: {
      fillColor: '#ffff00',
      fillOpacity: .5,
      strokeWeight: 2,
      clickable: false,
      editable: true,  
      zIndex: 1,
      draggable: true       
    },
     polylineOptions: {
      fillColor: '#ffff00',
      fillOpacity: .5,
      strokeWeight: 2,
      clickable: false,
      editable: true,
      zIndex: 1,
      draggable: true     
    },
     rectangleOptions: {
      fillColor: '#ffff00',
      fillOpacity: .5,
      strokeWeight: 2,
      clickable: false,
      editable: true,
      zIndex: 1,
      draggable: true
    }
     
  });
// adds the drawing manger to the map
  drawingManager.setMap(map);
    
// array to store the overlays
var stemBoundaries = [];
    
    
 
// tests whether a circle was made to the map, gives the radius 
  google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
  var radius = circle.getRadius();
  console.log('the radius is '+ radius);
});

// shows the circle has been made, gives the same radius  
google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
  if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
    var radius = event.overlay.getRadius();
    console.log('the shape has a radius of '+ radius);
  }
    
// shows the polygon has been made, gives the same radius   
  else if (event.type == google.maps.drawing.OverlayType.POLYGON) {
      
// find the area of the polygon.
      console.log('the area of the polygon is ');
  }

// shows the polyline has been made, gives the same radius     
  else if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
      
// find the length of the polyline.
      console.log('the length of the polyline is ');
  }
 
// shows the rectangle has been made, gives the same radius     
    else if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
      
// find the area of the rectangle.
      console.log('the area of the rectangle is ');
  }
});

   
// create an info window to initiate user position.  
var infoWindow = new google.maps.InfoWindow({map: map});

// finds the users initial coordinates and repositions the map to center around the user.  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
        
    
    var coordinateClick = document.getElementById('coordinate');
    
    coordinateClick.onclick = function() {
    alert("Your latitude is: " + position.coords.latitude + ", your longitude is: " + position.coords.longitude);
    }
        
    
// reposition map to the user's position.
      map.setCenter(pos);
        
// zoom onto the user
      map.setZoom(16);
        
      console.log("your initial position is latitude:" + position.coords.latitude + ", longitude: " + position.coords.longitude);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

//pointless coordinate button.
function prepareEventHandlers () {

    /*
    var coordinateClick = document.getElementById('coordinate');
    
    coordinateClick.onclick = function() {
    alert("latitude: " + position.coords.latitude + ", longitude + " + position.coords.longitude);
    }*/
}

//event handler happens onload
window.onload = function () {
    prepareEventHandlers();
}



