function createRecenterButton() {
    // Create a button for recenter the map to Bucharest
    var button = document.createElement('button');
    button.textContent = 'Recenter Map';
    button.classList.add('map-button'); // CSS

    // Add click event listener for the recenter button
    button.addEventListener('click', function() {
        map.setCenter(centerBucharest);
        map.setZoom(12);
    });

    // Return the created button element
    return button;
}