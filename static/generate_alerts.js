$.getScript("https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js")
.done(function(script, textStatus) {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
    window.addEventListener("load", initMap);
});

const centerBucharest = { lat: 44.4268, lng: 26.10246 };
const milliseconds = 1000;
const circleRadius = 1500;
let map;
let searchBox;
let icon;
let trafficLayer;
let infoWindows = [];
let mapMarkers = [];
let circles = [];

function initMap() {
  map = new mapboxgl.Map({
    container: 'generate_alerts', // Same as the id of your map element
    style: 'mapbox://styles/mapbox/streets-v11',
    center: centerBucharest,
    zoom: 12
  });

  createLabel('Generate Alerts Map');
  createSearchBox();
  icon = createIcon('hiddenGenerateAlertIcon');
  createButtons();
  displayMarkers();
  
  // Right-click event in Mapbox
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

  setInterval(displayMarkers, milliseconds);
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

    if (existingMarker && existingMarker.dataChanged(markerData)) {
      existingMarker.infoWindow.setText(createContentGenerateAlerts(markerData));
      existingMarker.data = markerData;
      updateCircle(existingMarker.id, markerData);
    } else {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      
      const marker = new mapboxgl.Marker({
        element: markerElement,
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
        "circle-color": "#FFCC33",
        "circle-opacity": 0.4
      }
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

  const toggleTrafficLayerButton = createToggleTrafficLayerButton();
  customControlDiv.appendChild(toggleTrafficLayerButton);

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
  customLabelDiv.className = 'map-label';  // Add custom styling to your label

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
    countries: base_country.toLowerCase(),  // Restrict to a specific country
  });

  document.getElementById('search-input').appendChild(geocoder.onAdd(map));

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