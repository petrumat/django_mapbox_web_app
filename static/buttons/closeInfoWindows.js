function createCloseInfoWindowsButton() {
    // Create a button for closing info windows (popups)
    var button = document.createElement('button');
    button.textContent = 'Close Markers';
    button.classList.add('map-button');

    // Add click event listener for the close button
    button.addEventListener('click', function() {
        infoWindows.forEach(infoWindow => {
            infoWindow.remove();
        });
    });

    return button;
}