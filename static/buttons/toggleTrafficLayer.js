function createToggleTrafficLayerButton() {
    // Create a button for toggle layers on map
    var button = document.createElement('button');
    button.textContent = 'Layer';
    button.classList.add('map-button'); // CSS

    // Variable to track current layer
    var isTrafficLayer = false;

    // Add click event listener for the button
    button.addEventListener('click', function() {
        if (isTrafficLayer) {
            // If traffic layer is active, switch to default layer
            trafficLayer.setMap(null);
            isTrafficLayer = false;
        } else {
            // If default layer is active, switch to traffic layer
            trafficLayer.setMap(map);
            isTrafficLayer = true;
        }
    });

    // Return the created button element
    return button;
}