mapboxgl.accessToken = mapboxPublicToken;
window.addEventListener("load", initMap);

const centerBucharest = { lat: 44.4268, lng: 26.10246 }
const milliseconds = 1000;

let infoWindows = [];
let mapMarkers = [];

function initMap() {
  map = createMap(centerBucharest);

  // createLabel('Generate Reports Map');
  createSearchBox(map, mapboxgl, base_country);
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  createButtons(map, 0, 1, 1, 1);

  icon = createIcon('hiddenGenerateReportIcon');
  displayMarkers(map, '/generateReportsData', icon);
  
  // NEEDS WORK!
  addMarkerEvent(map, mapboxgl, icon, mapMarkers, '/saveReport');

  updateMapMode(map);

  // setInterval(displayMarkers, milliseconds);
}

async function displayMarkers(map, link, icon) {
  const markers = await fetchMarkerData(link);

  markers.forEach((markerData, index) => {
    const existingMarker = mapMarkers.find(marker => marker.id === markerData.id);

    // If an existing marker is found and its data has changed, update it
    if (existingMarker && existingMarker.dataChanged(markerData)) {
        existingMarker.infoWindow.setContent(createContentGenerateReports(markerData));
        existingMarker.data = markerData;
    } else {
      // NEEDS WORK !
        // Build the marker content
        const contentString = createContentGenerateReports(markerData);
        // Create a new InfoWindow instance for each marker
      // NEEDS WORK !

        const marker = new mapboxgl.Marker({
          element: icon,
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