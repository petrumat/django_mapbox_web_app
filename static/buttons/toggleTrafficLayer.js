function createToggleTrafficLayerButton() {
    // Create a button for toggling layers on the map
    var button = document.createElement('button');
    button.textContent = 'Toggle Traffic Layer';
    button.classList.add('map-button');

    var isTrafficLayer = false;

    // Add click event listener for the button
    button.addEventListener('click', function() {
        if (isTrafficLayer) {
            map.setStyle('mapbox://styles/mapbox/streets-v11');
            isTrafficLayer = false;
        } else {
            map.setStyle('mapbox://styles/mapbox/traffic-night-v2');
            isTrafficLayer = true;
        }
    });

    return button;
}