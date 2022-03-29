import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import DriverProvider from "./context/DriverContext";
import UserProvider from "./context/UserContext";

ReactDOM.render(
	<React.StrictMode>
		<DriverProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</DriverProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
