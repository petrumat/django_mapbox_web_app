function createIcon(elementId) {
    const imgSrc = document.getElementById(elementId).src;

    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = '50px';
    img.style.height = '50px';
    
    img.style.position = 'relative';
    img.style.transform = 'translate(-50%, -100%)';

    return img;
}



// General functions for building content strings
function appendGeolocation(lat, lng) {
    // return "<strong>Geolocation:</strong> [" + lat + ", " + lng + "]<br>";
    return "Latitude: " + lat + "<br>Longitude: " + lng + "<br>";
}

function appendString(tag, value) {
    return "<strong>" + tag + "</strong> " + value + "<br>";
}

function colorString(color, mark, string) {
    return "<strong style='color: " + color + ";'>" + mark + " " + string + "</strong><br>"
}

function appendHref(prefix, text, link, suffix) {
    return "<strong>" + prefix + "<a href=" + link + ">" + text + "</a>" + suffix + "</strong><br>";
}


// Traffic Info Map:
function createContentTrafficInfo(markerData) {
    var content = "<div>" +
        appendGeolocation(markerData.lat, markerData.lng) +
        appendString("Zone:", markerData.zone) +
        appendString("Density:", markerData.density) +
        appendString("Speed:", markerData.med_speed) + "<br>" +
        appendStringCondition(markerData.lights, "Traffic Lights") +
        appendStringCondition(markerData.cameras, "Traffic Cameras") +
        appendStringCondition(markerData.signs, "Traffic Signs") +
        appendStringCondition(markerData.incidents, "Traffic Incidents") +
        appendStringCondition(markerData.accidents, "Traffic Accidents") +
        appendIncidents(markerData.accidents, markerData.alert_content) +
        "</div>";
    
    return content;
}

function appendStringCondition(condition, string) {
    if (condition === true)
        return colorString("red", "❌", string);
    
    return colorString("green", "✔", string);
}

function appendIncidents(accidents, string) {
    if (accidents === false)
        if ((typeof string === "string" && string.length === 0) || string === null)
            return "<br>" + colorString("green", "", "No Alerts");
        else
            return "<br>" + colorString("orange", "", "Reported Incident: ") + colorString("black", "", string);
    else
        return "<br>" + colorString("red", "", "Reported Incident: ") + colorString("black", "", string);
}



// Traffic Lights Map:
function createContentTrafficLight(markerData) {
    var content = "<div>" +
        appendGeolocation(markerData.lat, markerData.lng) +
        appendString("Zone:", markerData.zone) +
        appendString("Orientation -", markerData.orientation) +
        appendFunctionState(markerData.functioning, markerData.function_error) +
        appendProgramState(markerData.program) +
        appendColorTime("Red", markerData.time_red) +
        appendColorTime("Yellow", markerData.time_yellow) +
        appendColorTime("Green", markerData.time_green) +
        appendError(markerData.error) +
        "</div>";
    
    return content;
}

function appendFunctionState(condition, string) {
    result = "<strong>Function State - </strong>";
    
    if (condition === false)
        return result + colorString("red", "", string);
    
    return result + colorString("green", "", "Normal");
}

function appendProgramState(string) {
    result = "<strong>Program State - </strong>";

    if (string === "AUTO")
        return result + colorString("green", "", string);
    
    return result + colorString("orange", "", string);
}

function appendColorTime(color, time) {
    return "<strong>" + color + " - </strong>" + time + " s<br>";
}

function appendError(string) {
    if (string != "")
        return colorString("red", "Error - ", string);
    
    return "";
}



// Generate Alerts Map
function createContentGenerateAlerts(markerData) {
    var content = '<div style="display: flex;">' +
        '<div style="width: 20%; padding-right: 10px; display: flex; align-items: center; justify-content: center; font-size: 3em;">' +
        '⚠️' +
        '</div>' +
        '<div style="width: 80%;">' +
        appendGeolocation(markerData.lat, markerData.lng) +
        appendString("Zone:", markerData.zone) +
        appendString("Recommended Speed:", markerData.speed) +
        colorString("orange", "", markerData.alert) +
        "</div>";

    return content;
}



// Generate Reports Map
function createContentGenerateReports(markerData) {
    var content = "<div>" +
        appendGeolocation(markerData.lat, markerData.lng) +
        appendString("Zone:", markerData.zone) +
        appendHref("", "Click to see report", markerData.link, "") +
        "</div>";

    return content;
}
