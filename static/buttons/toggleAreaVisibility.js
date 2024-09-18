function createToggleAreaVisibilityButton() {
    // Create a button for toggling area visibility
    var button = document.createElement('button');
    button.textContent = 'Visibility';
    button.classList.add('map-button');

    // Add click event listener for the area visibility button
    button.addEventListener('click', function() {
        toggleAreaVisibility();
    });

    return button;
}

function toggleAreaVisibility() {
    circles.forEach(circle => {
        const layerId = circle.id;

        if (map.getLayer(layerId)) {
            // If the circle is visible (exists as a layer), remove it
            map.removeLayer(layerId);
            map.removeSource(layerId);
        } else {
            // If the circle is not visible, add it back to the map
            map.addSource(layerId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [circle.lng, circle.lat]
                    }
                }
            });

            map.addLayer({
                id: layerId,
                type: 'circle',
                source: layerId,
                paint: {
                    'circle-radius': circleRadius,
                    'circle-color': '#FFCC33',
                    'circle-stroke-width': 3,
                    'circle-opacity': 0.5
                }
            });
        }
    });
}