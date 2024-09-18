function createRecenterButton() {
    // Create a button to center the map to Bucharest
    var button = document.createElement('button');
    button.textContent = 'Recenter';
    button.classList.add('map-button');

    // Add click event listener for the recenter button
    button.addEventListener('click', function() {
        map.setCenter([centerBucharest.lng, centerBucharest.lat]);
        map.setZoom(12);
    });

    return button;
}