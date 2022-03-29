import {
	GoogleMap,
	useLoadScript,
	DirectionsService,
	DirectionsRenderer
} from "@react-google-maps/api";
import { useState } from "react";

const mapContainerStyle = {
	width: "100%",
	height: "100%"
};

const options = {
	disableDefaultUI: true,
	zoomControl: true,
	clickableIcons: false
};

export default function Map({ origin, dest }) {
	const [directionResponse, setDirectionResponse] = useState(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API
	});

	if (loadError) return "Error loading maps";

	const renderMap = () => {
		return (
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				zoom={19}
				options={options}
				center={{ lat: 0, lng: -180 }}
			>
				<DirectionsService
					options={{
						origin: { lat: origin[0], lng: origin[1] },
						destination: { lat: dest[0], lng: dest[1] },
						travelMode: "DRIVING"
					}}
					callback={(response) => {
						// console.log(response);

						if (response !== null) {
							if (response.status === "OK") {
								setDirectionResponse(response);
							} else {
								// console.log(`response: ${response}`);
							}
						}
					}}
				/>

				{directionResponse !== null && (
					<DirectionsRenderer
						options={{
							directions: directionResponse
						}}
					/>
				)}
			</GoogleMap>
		);
	};

	return isLoaded ? renderMap() : "Loading map...";
}
