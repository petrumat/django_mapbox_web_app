function createToggleMapModeButton() {
    var button = document.createElement('button');
    button.textContent = 'Dark Mode';
    button.classList.add('map-button');

    var isTrafficLayer = false;

    // Add click event listener for the button
    button.addEventListener('click', function() {
        if (isTrafficLayer) {
            map.setStyle('mapbox://styles/mapbox/streets-v11');
            button.textContent = 'Dark Mode';
            isTrafficLayer = false;
        } else {
            map.setStyle('mapbox://styles/mapbox/traffic-night-v2');
            button.textContent = 'Light Mode';
            isTrafficLayer = true;
        }
    });

    return button;
}