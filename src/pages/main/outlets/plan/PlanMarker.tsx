//@ts-ignore
import mapboxgl from 'mapbox-gl';

export const createCustomMarker = () => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null, "viewBox", "0 0 90 100");
    svg.setAttributeNS(null, "width", "40");
    svg.setAttributeNS(null, "height", "40");
    svg.setAttributeNS(null, "class", "marker-svg");

    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttributeNS(null, "id", "pin-gradient");
    const startStop = document.createElementNS(svgNS, "stop");
    startStop.setAttributeNS(null, "offset", "0%");
    startStop.setAttributeNS(null, "stop-color", "#565656");
    gradient.appendChild(startStop);
    const endStop = document.createElementNS(svgNS, "stop");
    endStop.setAttributeNS(null, "offset", "100%");
    endStop.setAttributeNS(null, "stop-color", "#565656");
    gradient.appendChild(endStop);

    // Append gradient to defs
    const defs = document.createElementNS(svgNS, "defs");
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Define a filter for the backdrop blur effect
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttributeNS(null, "id", "blur-filter");
    const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feGaussianBlur.setAttributeNS(null, "in", "SourceGraphic");
    feGaussianBlur.setAttributeNS(null, "stdDeviation", "2"); // Adjust the blur amount
    filter.appendChild(feGaussianBlur);
    svg.appendChild(filter);

    // Create the backdrop circle
    const backdrop = document.createElementNS(svgNS, "circle");
    backdrop.setAttributeNS(null, "cx", "45");
    backdrop.setAttributeNS(null, "cy", "38");
    backdrop.setAttributeNS(null, "r", "25");
    backdrop.setAttributeNS(null, "fill", "rgba(100,100,100,0.7)");
    backdrop.setAttributeNS(null, "filter", "url(#blur-filter)");
    svg.appendChild(backdrop);

    // Create a path element for the check
    const checkPath = document.createElementNS(svgNS, "path");
    checkPath.setAttributeNS(null, "d", "M27 55L6 33 9 29 26 41 55 12 59 16z");
    checkPath.setAttributeNS(null, "fill", "#FFFFFF");
    checkPath.setAttributeNS(null, "transform", "scale(0.5) translate(56, 42)"); // Scale down the check and adjust the position
    svg.appendChild(checkPath);

    const pinShapePath= "M 71.396 10.403 C 63.471 3.006 53.119 -0.658 42.253 0.097 C 23.437 1.396 8.044 16.537 6.447 35.314 c -1.53 17.987 9.33 34.489 26.409 40.129 c 1.602 0.529 2.924 1.592 3.723 2.991 l 5.692 9.98 C 42.837 89.407 43.857 90 45 90 c 0 0 0 0 0.001 0 c 1.143 0 2.162 -0.593 2.727 -1.586 l 5.693 -9.98 c 0.798 -1.399 2.12 -2.462 3.722 -2.991 c 15.882 -5.245 26.553 -20.011 26.553 -36.744 C 83.696 28.012 79.213 17.698 71.396 10.403 z M 45 67.821 c -16.058 0 -29.122 -13.064 -29.122 -29.122 C 15.878 22.641 28.942 9.576 45 9.576 c 16.058 0 29.122 13.064 29.122 29.122 C 74.122 54.757 61.058 67.821 45 67.821 z";
    // Create the pin shape
    const pinPath = document.createElementNS(svgNS, "path");
    pinPath.setAttributeNS(null, "d", pinShapePath);
    pinPath.setAttributeNS(null, "fill", "#6173fa"); // Original color
    svg.appendChild(pinPath);

    // Create the animated pin shape with limegreen color
    const animatedPinPath = pinPath.cloneNode(true) as SVGPathElement; // Cast to SVGPathElement
    animatedPinPath.setAttributeNS(null, "fill", "#44a1f2"); // Animated color
    animatedPinPath.style.opacity = "0"; // Initially hidden
    animatedPinPath.style.transition = "opacity 0.75s"; // Fade in/out effect
    svg.appendChild(animatedPinPath);

    // Create a div element that will serve as the marker container
    const markerEl = document.createElement('div');
    markerEl.appendChild(svg);

    markerEl.onmouseenter = () => {
        animatedPinPath.style.opacity = "1"; // Show on hover
    };
    markerEl.onmouseleave = () => {
        animatedPinPath.style.opacity = "0"; // Hide on mouse leave
    };
    // Create a new Mapbox marker with the SVG element
    return new mapboxgl.Marker({
        element: markerEl,
        draggable: true,
        offset: [0, -20] // Adjust the offset if needed
    });
};



export const createStartMarker = () =>{
    const pinImage = document.createElement('img');
    pinImage.src = '/images/start.png'; // Replace with the path to your pin shape PNG image
    pinImage.style.width = '40px'; // Adjust the width if needed
    pinImage.style.height = '40px';
    const markerEl = document.createElement('div');
    markerEl.appendChild(pinImage);
    return new mapboxgl.Marker({
        element: markerEl,
        draggable: false,
        offset: [0, -20] // Adjust the offset if needed
    });
};

export const createFinishMarker = () =>{
    const pinImage = document.createElement('img');
    pinImage.src = '/images/finish.png'; // Replace with the path to your pin shape PNG image
    pinImage.style.width = '40px'; // Adjust the width if needed
    pinImage.style.height = '40px';
    const markerEl = document.createElement('div');
    markerEl.appendChild(pinImage);
    return new mapboxgl.Marker({
        element: markerEl,
        draggable: false,
        offset: [0, -20] // Adjust the offset if needed
    });
};