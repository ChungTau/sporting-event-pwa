import {motion} from "framer-motion";
import Center from "../../components/Center";
import {fadeVariants} from "../../constants/animateVariant";

// Code9
import { useState } from "react";
import ReactDOM from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';




// Code9 Temporary
function GPSPage() {

	function getLocation(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			console.log("Geolocation not supported");
		}

		function success(position: any) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
			// msg = "OK"
			setColor("green");
			setLat(latitude);
			setLong(longitude);
		}

		function error() {
			console.log("Unable to retrieve your location");
			// msg = "Error"
		}
	}


		const [color, setColor] = useState("red");


		const d = 3.5;
		const msg = "";
		const [lat, setLat] = useState(0);
		const [long, setLong] = useState(0);
		// const long = 0;
		
   mapboxgl.accessToken = 'pk.eyJ1IjoiaGt1c3RnaWI1IiwiYSI6ImNscWllMDN2ZzFzOG0ya21kbThtc2p5aDYifQ.VqYPzJ_2tRigF5thlG8A-w'; 
    const map = new mapboxgl.Map({
      container: 'map',
      // Replace YOUR_STYLE_URL with your style URL.
      style: 'mapbox://styles/hkustgib5/clqv45j5n00y301qu4wwp9poe', 
      center: [114.2, 22.4],
      zoom: 18
    });
		
		var geolocate = new mapboxgl.GeolocateControl();
		var isLogging = false;

		map.addControl(geolocate);

		geolocate.on('geolocate', function(e) {
					var lon = e.coords.longitude;
					var lat = e.coords.latitude
					var position = [lon, lat];
					// console.log(position);
					document.getElementById("coordinates").innerHTML = `${lon}, ${lat}`;
					map.setZoom(14);
		});
		
		setInterval(function() {
    $(".mapboxgl-ctrl-geolocate").click();
		console.log("Clicked");
		},5000);

    return (
        <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
            duration: 0.5
        }}>
				
				
				
            <Center>Get your GPS Coordinates:</Center>
            <Center>Coordinates: {lat} {long} {color}</Center>
						<Center><button onClick={getLocation}>Click</button></Center>
						<div id="map">test</div>
        </motion.div>
    );
};

export default GPSPage;