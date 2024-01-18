import {motion} from "framer-motion";
import Center from "../../components/Center";
import {fadeVariants} from "../../constants/animateVariant";

// Code9
import { useState } from "react";
import ReactDOM from 'react-dom/client';


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
        </motion.div>
    );
};

export default GPSPage;