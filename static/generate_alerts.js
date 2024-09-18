mapboxgl.accessToken = mapboxPublicToken;
window.addEventListener("load", initMap);

const centerBucharest = { lat: 44.4268, lng: 26.10246 };
const milliseconds = 1000;
const circleRadius = 1500;

let infoWindows = [];
let mapMarkers = [];
let circles = [];

function initMap() {
  map = createMap(centerBucharest);

  // createLabel('Generate Alerts Map');
  createSearchBox(map, mapboxgl, base_country);
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  createButtons(map, visibility=1, infoWindows=1, recenter=1, mapMode=1);

  icon = createIcon('hiddenGenerateAlertIcon');
  displayMarkers();
  
  // NEEDS WORK! Function to add point on map to generate alert around it:
  addMarkerEvent(map, mapboxgl, icon, infoWindow, mapMarkers, '/saveAlert');

  updateMapMode(map);

  // setInterval(displayMarkers, milliseconds);
}

// NEEDS WORK!
async function displayMarkers(link) {
  const markers = await fetchMarkerData('/generateAlertsData');

  markers.forEach((markerData) => {
    const existingMarker = mapMarkers.find(marker => marker.id === markerData.id);

    // If an existing marker is found and its data has changed, update it
    if (existingMarker && existingMarker.dataChanged(markerData)) {
      existingMarker.infoWindow.setText(createContentGenerateAlerts(markerData));
      existingMarker.data = markerData;
      updateCircle(existingMarker.id, markerData);
    } else {
    // NEEDS WORK !
      // Build the marker content
      const contentString = createContentGenerateAlerts(markerData);
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

      if (!circles[markerData.id]) {
        updateCircle(markerData.id, markerData);
      }

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

function updateCircle(markerId, markerData) {
  if (circles[markerId]) {
    map.getSource(`circle-${markerId}`).setData({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [markerData.lng, markerData.lat]
      }
    });
  } else {
    map.addSource(`circle-${markerId}`, {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [markerData.lng, markerData.lat]
        }
      }
    });

    map.addLayer({
      "id": `circle-${markerId}`,
      "type": "circle",
      "source": `circle-${markerId}`,
      "paint": {
        "circle-radius": {
          "base": 1.75,
          "stops": [[12, 2], [22, circleRadius / 10]]
        },
        'circle-stroke-width': 3,
        "circle-color": "#FFCC33",
        "circle-opacity": 0.4
      }
    });
    circles.push({
      id: `circle-${markerId}`,
      lng: markerData.lng,
      lat: markerData.lat
    });

    circles[markerId] = true;
  }
}

