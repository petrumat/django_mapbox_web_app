function createCloseInfoWindowsButton() {
    // Create a button for recenter the map to Bucharest
    var button = document.createElement('button');
    button.textContent = 'Close Markers';
    button.classList.add('map-button'); // CSS

    // Add click event listener for the recenter button
    button.addEventListener('click', function() {
        infoWindows.forEach(infoWindow => {
            infoWindow.close();
        });
    });

    // Return the created button element
    return button;
}