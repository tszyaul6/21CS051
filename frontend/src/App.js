import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Receive from "./pages/Receive/Receive";
import Orders from "./pages/Orders/Orders";
import OptOrders from "./pages/Orders/OptOrders";
import Send from "./pages/Send/Send";
import Login from "./pages/Login/Login";
import { useContext, useEffect } from "react";
import { DriverContext } from "./context/DriverContext";

let setIntervalPtr;

function App() {
	const driverContext = useContext(DriverContext);

	useEffect(() => {
		const getDriverLocation = () => {
			const success = ({ coords: { latitude: lat, longitude: lng } }) => {
				let requestBody = {
					query: `
						mutation {
							updateDriverCoordinates(driverId: "${driverContext.driver.driverId}", coordinatesInput: {lat: ${lat}, lng: ${lng}}) {
								name
								coordinates
							}
						}	
					`
				};

				fetch(process.env.REACT_APP_BACKEND_API, {
					method: "POST",
					body: JSON.stringify(requestBody),
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${driverContext.driver.token}`
					}
				}).catch((err) => console.log(err));
			};
			const error = (err) => {
				console.warn(`Error(${err.code}): ${err.message}`);
			};
			navigator.geolocation.getCurrentPosition(success, error);
		};

		if (driverContext.driver.driverId) {
			getDriverLocation();
			// Loop every 5 minutes
			setIntervalPtr = setInterval(getDriverLocation, 5 * 60 * 1000);
		} else {
			clearInterval(setIntervalPtr);
		}
	}, [driverContext]);

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route
						exact
						path="/"
						element={
							driverContext.driver.driverId ? (
								<Orders />
							) : (
								<Home />
							)
						}
					></Route>
					<Route path="/orders" element={<Orders />}></Route>
					<Route
						path="/receive"
						element={
							driverContext.driver.driverId ? (
								<Orders />
							) : (
								<Receive />
							)
						}
					></Route>
					<Route
						path="/send"
						element={
							driverContext.driver.driverId ? (
								<Orders />
							) : (
								<Send />
							)
						}
					></Route>
					<Route
						path="/optorders"
						element={
							driverContext.driver.driverId ? (
								<OptOrders />
							) : (
								<Home />
							)
						}
					></Route>
					<Route path="/login" element={<Login />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
