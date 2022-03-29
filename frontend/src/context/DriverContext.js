import { createContext, useState } from "react";

export const DriverContext = createContext({
	driver: { token: "", driverId: "" },
	login: () => {},
	logout: () => {}
});

const DriverProvider = ({ children }) => {
	const [driver, setDriver] = useState({ token: "", driverId: "" });

	const login = (token, driverId) => {
		setDriver(() => {
			return {
				token,
				driverId
			};
		});
	};

	const logout = () => {
		setDriver(() => {
			return {
				token: "",
				driverId: ""
			};
		});
	};

	return (
		<DriverContext.Provider value={{ driver, login, logout }}>
			{children}
		</DriverContext.Provider>
	);
};

export default DriverProvider;
