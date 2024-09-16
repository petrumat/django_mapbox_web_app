function createMapLabel(textContent) {
    // Create a button with no functionality
    var button = document.createElement('button');
    button.textContent = textContent;
    button.classList.add('map-label'); // CSS

    // Check if the map width is less than 900px
    function toggleVisibility() {
        if (map.getDiv().offsetWidth < 900) {
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
        }
    }

    // Toggle visibility initially
    // toggleVisibility();

    // Add event listener to toggle visibility on map resize
    // google.maps.event.addDomListener(window, 'resize', toggleVisibility);

    // Return the created button element
    return button;
}