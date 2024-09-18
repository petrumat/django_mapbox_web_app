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
  createButtons(map, visibility=0, infoWindows=1, recenter=1, mapMode=1);

  trafficInfoGreenIcon = createIcon('hiddenTrafficInfoGreenIcon');
  trafficInfoYellowIcon = createIcon('hiddenTrafficInfoYellowIcon');
  trafficInfoRedIcon = createIcon('hiddenTrafficInfoRedIcon');
  displayMarkers(trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon);
  
  // NEEDS WORK! Function to add point on map with user info
  addMarkerEvent(map, mapboxgl, icon, infoWindow, mapMarkers, '/saveInfo');

  updateMapMode(map);

  // setInterval(displayMarkers, milliseconds);
}

async function displayMarkers() {
  // Fetch marker data from Django backend
  const markers = await fetchMarkerData('/trafficInfoData');

  // Iterate over the markers array
  markers.forEach((markerData, index) => {
    const existingMarker = mapMarkers.find(marker => marker.id === markerData.id);

    // If an existing marker is found and its data has changed, update it
    if (existingMarker && existingMarker.dataChanged(markerData)) {
        existingMarker.infoWindow.setContent(createContentTrafficInfo(markerData));
        existingMarker.marker.setIcon(chooseMarkerIcon(markerData.icon, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon));
        existingMarker.data = markerData;
    } else {
        // Build the marker content
        const contentString = createContentTrafficInfo(markerData);

        // Create a new InfoWindow instance for each marker
        const infoWindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: markerData.ariaLabel,
        });
        infoWindows.push(infoWindow);

        // Create a marker and attach the info window to it
        const marker = new google.maps.Marker({
            position: { lat: markerData.lat, lng: markerData.lng },
            map,
            icon: chooseMarkerIcon(markerData.icon, trafficInfoGreenIcon, trafficInfoYellowIcon, trafficInfoRedIcon),
            title: markerData.title,
        });

        // Add a click event listener to the marker
        marker.addListener("click", () => {
          infoWindow.open({ anchor: marker, map });
        });

        // Add the marker to the array of marker objects
        mapMarkers.push({
            id: markerData.id,
            marker,
            infoWindow,
            data: markerData,
            dataChanged(newData) {
                // Check if any property of the marker's data has changed
                return JSON.stringify(this.data) !== JSON.stringify(newData);
            }
        });
    }
  });
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