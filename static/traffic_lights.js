mapboxgl.accessToken = mapboxPublicToken;
window.addEventListener("load", initMap);

const centerBucharest = { lat: 44.4268, lng: 26.10246 }
const milliseconds = 10000;

let infoWindows = [];
let mapMarkers = [];

function initMap() {
  map = createMap(centerBucharest);

  // createLabel('Traffic Lights Map');
  createSearchBox(map, mapboxgl, base_country);
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  createButtons(map, visibility=0, infoWindows=1, recenter=1, mapMode=1);

  iconGreen = createIcon('hiddenTrafficLightGreenIcon');
  iconRed = createIcon('hiddenTrafficLightRedIcon');
  icon = createIcon('hiddenTrafficLightIcon');
  displayMarkers(iconGreen, iconRed, icon);
  
  updateMapMode(map);

  // setInterval(displayMarkers, milliseconds);
}

async function displayMarkers(iconGreen, iconRed, icon) {
  // Fetch marker data from Django backend
  const markers = await fetchMarkerData('/trafficLightsData');

  // Iterate over the markers array
  markers.forEach((markerData, index) => {
    const existingMarker = mapMarkers.find(marker => marker.id === markerData.id);

    // If an existing marker is found and its data has changed, update it
    if (existingMarker && existingMarker.dataChanged(markerData)) {
        existingMarker.infoWindow.setContent(createContentTrafficLight(markerData));
        existingMarker.marker.setIcon(chooseMarkerIcon(markerData.functioning, iconGreen, iconRed, icon));
        existingMarker.data = markerData;
    } else {
        // Build the marker content
        const contentString = createContentTrafficLight(markerData);

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
            icon: chooseMarkerIcon(markerData.functioning, iconGreen, iconRed, icon),
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

function chooseMarkerIcon(functioning, iconGreen, iconRed, icon) {
  switch (functioning) {
    case true:
      return iconGreen;
    case false:
      return iconRed;
    default:
      console.log('Unknown icon in traffic_lights.js');
      return icon;
  }
}