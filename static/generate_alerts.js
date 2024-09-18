mapboxgl.accessToken = mapboxPublicToken;
window.addEventListener("load", initMap);

const centerBucharest = { lat: 44.4268, lng: 26.10246 };
const milliseconds = 1000;
const circleRadius = 1500;

let map;
let icon;
let infoWindows = [];
let mapMarkers = [];
let circles = [];

function initMap() {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: centerBucharest,
    zoom: 12
  });

  // createLabel('Generate Alerts Map');
  createSearchBox();
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  createButtons();

  icon = createIcon('hiddenGenerateAlertIcon');
  displayMarkers();
  
  map.on('contextmenu', function(event) {
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;

    // Geocode the coordinates to get the address
    geocodeLatLng(lat, lng, (address) => {
        if (address) {
            addMarker(lat, lng, address);
        } else {
            console.error('Failed to get address for the coordinates.');
        }
    });
  });

  map.on('styledata', function() {
    const currentStyle = map.getStyle().name;
  
    if (currentStyle.toLowerCase().includes('night')) {
      const mapContainer = map.getContainer();
      mapContainer.classList.add('night-mode');
    } else {
      const mapContainer = map.getContainer();
      mapContainer.classList.remove('night-mode');
    }
  });

  // Needs function to add point on map to generate alert around it

  // setInterval(displayMarkers, milliseconds);
}

async function fetchMarkerData() {
  try {
    const response = await fetch('/generateAlertsData');
    return await response.json();
  } catch (error) {
    console.error('Error fetching marker generateAlertsData:', error);
    return [];
  }
}

async function displayMarkers() {
  const markers = await fetchMarkerData();

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

function createButtons() {
  const customControlDiv = document.createElement('div');
  
  const toggleAreaVisibilityButton = createToggleAreaVisibilityButton();
  customControlDiv.appendChild(toggleAreaVisibilityButton);

  const closeInfoWindowsButton = createCloseInfoWindowsButton();
  customControlDiv.appendChild(closeInfoWindowsButton);

  const recenterButton = createRecenterButton();
  customControlDiv.appendChild(recenterButton);

  const toggleMapModeButton = createToggleMapModeButton();
  customControlDiv.appendChild(toggleMapModeButton);

  map.addControl({
    onAdd: function() {
      return customControlDiv;
    },
    onRemove: function() {
      customControlDiv.parentNode.removeChild(customControlDiv);
    }
  }, 'top-right');
}

function createLabel(textContent) {
  const customLabelDiv = document.createElement('div');
  customLabelDiv.className = 'map-label';

  const label = document.createElement('span');
  label.innerText = textContent;
  customLabelDiv.appendChild(label);

  map.addControl({
    onAdd: function() {
      return customLabelDiv;
    },
    onRemove: function() {
      customLabelDiv.parentNode.removeChild(customLabelDiv);
    }
  }, 'top-left');
}

function createSearchBox() {
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: base_country.toLowerCase(),
    placeholder: 'Search for places',
  });

  map.addControl(geocoder, 'top-left');

  geocoder.on('result', (event) => {
    const [lng, lat] = event.result.geometry.coordinates;
    map.flyTo({ center: [lng, lat], zoom: 14 });
  });
}

function geocodeLatLng(lat, lng, callback) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.features.length > 0) {
        callback(data.features[0].place_name);
      } else {
        callback(null);
      }
    })
    .catch(err => {
      console.error('Error fetching address:', err);
      callback(null);
    });
}

function addMarker(lat, lng, label) {
  const marker = new mapboxgl.Marker({
    element: icon,
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
    //   content: "New Marker"
    // });
    // marker.addListener("click", () => {
    //   infoWindow.open({ anchor: marker, map });
    // });
  // NEEDS WORK!
  
  mapMarkers.push(marker);
  saveMarkerToBackend(lat, lng, label);
}

async function saveMarkerToBackend(lat, lng, label) {
  try {
    const response = await fetch('/saveAlert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lat, lng, label })
    });

    if (response.ok) {
      console.log('Marker saved successfully');
    } else {
      console.error('Error saving marker:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving marker:', error);
  }
}

