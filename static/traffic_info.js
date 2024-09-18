mapboxgl.accessToken = mapboxPublicToken;
window.addEventListener("load", initMap);

const centerBucharest = { lat: 44.4268, lng: 26.10246 }
const milliseconds = 1000;

let infoWindows = [];
let mapMarkers = [];

function initMap() {
  map = createMap(centerBucharest);

  // createLabel('Traffic Info Map');
  createSearchBox(map, mapboxgl, base_country);
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  createButtons(map, 0, 1, 1, 1);

  const trafficInfoGreenIcon = createIcon('hiddenTrafficInfoGreenIcon');
  const trafficInfoYellowIcon = createIcon('hiddenTrafficInfoYellowIcon');
  const trafficInfoRedIcon = createIcon('hiddenTrafficInfoRedIcon');
  displayMarkers(map, '/trafficInfoData', trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon);

  
  // NEEDS WORK! Function to add point on map with user info
  addMarkerEventTrafficInfo(map, mapboxgl, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon, '/saveInfo');

  updateMapMode(map);

  // setInterval(displayMarkers, milliseconds);
}

async function displayMarkers(map, link, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon) {
  // Fetch marker data from Django backend
  const markers = await fetchMarkerData(link);

  // Iterate over the markers array
  markers.forEach((markerData, index) => {
    const existingMarker = mapMarkers.find(marker => marker.id === markerData.id);

    // If an existing marker is found and its data has changed, update it
    if (existingMarker && existingMarker.dataChanged(markerData)) {
        existingMarker.infoWindow.setContent(createContentTrafficInfo(markerData));
        existingMarker.marker.setIcon(chooseMarkerIcon(markerData.icon, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon));
        existingMarker.data = markerData;
    } else {
        // NEEDS WORK !
      // Build the marker content
      const contentString = createContentGenerateAlerts(markerData);
      // Create a new InfoWindow instance for each marker
    // NEEDS WORK !

      const marker = new mapboxgl.Marker({
        element: chooseMarkerIcon(markerData.icon, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon),
      })
      .setLngLat([markerData.lng, markerData.lat])
      .addTo(map);

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(createContentGenerateAlerts(markerData));

      marker.getElement().addEventListener('click', () => {
        popup.addTo(map);
      });

      mapMarkers.push({
        id: markerData.id,
        marker,
        infoWindow: popup,
        data: markerData,
        dataChanged(newData) {
          return JSON.stringify(this.data) !== JSON.stringify(newData);
        }
      });
    }
  });
}

function addMarkerEventTrafficInfo(map, mapboxgl, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon, link) {
  map.on('contextmenu', function(event) {
      const lng = event.lngLat.lng;
      const lat = event.lngLat.lat;
  
      // Geocode the coordinates to get the address
      geocodeLatLng(lat, lng, (address) => {
          if (address) {
              addMarkerTrafficInfo(lat, lng, address, map, mapboxgl, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon, link);
          } else {
              console.error('Failed to get address for the coordinates.');
          }
      }, mapboxgl);
  });
}

function addMarkerTrafficInfo(lat, lng, label, map, mapboxgl, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon, link) {
  const marker = new mapboxgl.Marker({
      element: chooseMarkerIcon("green", trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon),
  })
  .setLngLat([lng, lat])
  .addTo(map);

  const infoWindow = mapboxgl.Popup({ offset: 25 })
      .setText("New Marker")
      .setLngLat([lng, lat])
      .addTo(map);
  
    marker.getElement().addEventListener('click', () => {
          infoWindow.addTo(map);
    });  

  // NEEDS WORK!
      // const infoWindow = new google.maps.InfoWindow({
      //     content: "New Marker"
      // });
      // marker.addListener("click", () => {
      //     infoWindow.open({ anchor: marker, map });
      // });
  // NEEDS WORK!
  
  mapMarkers.push(marker);
  saveMarkerToBackend(lat, lng, label, link);
}

function chooseMarkerIcon(icon, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon) {
  switch (icon) {
      case "green":
          return trafficInfoGreenIcon;
      case "yellow":
          return trafficInfoYellowIcon;
      case "red":
          return trafficInfoRedIcon;
      default:
          console.log('Unknown icon in traffic_info.js');
          return null;
  }
}