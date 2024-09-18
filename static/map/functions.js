function createMap(center){
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 12
    });

    return map
}

function createLabel(map, textContent) {
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

function createSearchBox(map, mapboxgl, base_country) {
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

function createButtons(map, visibility, infoWindows, recenter, mapMode) {
    const customControlDiv = document.createElement('div');
    
    if (visibility) {
        const toggleAreaVisibilityButton = createToggleAreaVisibilityButton();
        customControlDiv.appendChild(toggleAreaVisibilityButton);
    }
  
    if (infoWindows) {
        const closeInfoWindowsButton = createCloseInfoWindowsButton();
        customControlDiv.appendChild(closeInfoWindowsButton);
    }
  
    if (recenter) {
        const recenterButton = createRecenterButton();
        customControlDiv.appendChild(recenterButton);
    }
  
    if (mapMode) {
        const toggleMapModeButton = createToggleMapModeButton();
        customControlDiv.appendChild(toggleMapModeButton);
    }
  
    map.addControl({
        onAdd: function() {
            return customControlDiv;
        },
        onRemove: function() {
            customControlDiv.parentNode.removeChild(customControlDiv);
        }
    }, 'top-right');
}

async function fetchMarkerData(link) {
    try {
        const response = await fetch(link);
        return await response.json();
    } catch (error) {
        console.error('Error fetching marker generateAlertsData:', error);
        return [];
    }
}
  
function updateMapMode(map) {
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
}