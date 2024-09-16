$.getScript( "https://maps.googleapis.com/maps/api/js?key=" + google_api_key + "&libraries=places") 
.done(function( script, textStatus ) {
    window.addEventListener("load", initMap);
});


function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map-route'), {
      zoom: 7,
      center: { lat: lat_a, lng: long_a }
  });

  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);

  displayMarker(map);

}

const waypts = [
        {location: {lat: lat_c, lng: long_c},
        stopover: true},
        {location: {lat: lat_d, lng: long_d},
        stopover: true}
        ];

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);


      } else {

        alert('Directions request failed due to ' + status);
        window.location.assign("/route")
      }
    });
}


function displayMarker(map) {
  // Create a new InfoWindow instance
  const infoWindow = new google.maps.InfoWindow({
      content: "Hello, World! From pop-up",
      ariaLabel: "Hi",
  });
  // Create a marker and attach the info window to it
  const marker = new google.maps.Marker({
      position: { lat: 46.0000000, lng: 26.0000000 },
      map,
      title: "I'm here",
  });

  // Add a click event listener to the marker
  marker.addListener("click", () => {
      infoWindow.open({ anchor: marker, map, });
  });
}