export default function Locate({ panTo }) {
	return (
		<button
			className="absolute right-0 z-10"
			onClick={() => {
				navigator.geolocation.getCurrentPosition(
					(pos) => {
						const { latitude, longitude } = pos.coords;
						panTo({ lat: latitude, lng: longitude });
					},
					(err) => {
						console.log(err);
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0
					}
				);
			}}
		>
			Locate
		</button>
	);
}
