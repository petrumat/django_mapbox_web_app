function createToggleAreaVisibilityButton() {
    // Create a button for recenter the map to Bucharest
    var button = document.createElement('button');
    button.textContent = 'Area Visibility';
    button.classList.add('map-button'); // CSS

    // Add click event listener for the recenter button
    button.addEventListener('click', function() {
        toggleAreaVisibility();
    });

    // Return the created button element
    return button;
}

function toggleAreaVisibility() {
    circles.forEach(circle => {
        if (circle.getVisible())
            circle.setVisible(false);
        else
            circle.setVisible(true);
    });
}