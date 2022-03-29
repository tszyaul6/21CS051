import { createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = createContext({
	allSavedOrderIds: [],
	pushOrder: (orderId) => {},
	removeOrder: () => {},
	resetAllSavedOrders: () => {},
	isOrderExists: (id) => {}
});

const UserProvider = ({ children }) => {
	const [allSavedOrderIds, setAllSavedOrders] = useLocalStorage(
		"allSavedOrderIds",
		[]
	);

	const pushOrder = (orderId) => {
		const updatedAllSavedOrders = JSON.stringify([
			...allSavedOrderIds,
			orderId
		]);
		setAllSavedOrders(updatedAllSavedOrders);
	};

	const removeOrder = (id) => {
		let modifiedOrders = JSON.stringify(
			allSavedOrderIds.filter((orderId) => id !== orderId)
		);
		setAllSavedOrders(modifiedOrders);
	};

	const resetAllSavedOrders = () => {
		setAllSavedOrders("[]");
	};

	const isOrderExists = (id) => {
		return allSavedOrderIds.some((orderId) => {
			return orderId === id;
		});
	};

	return (
		<UserContext.Provider
			value={{
				allSavedOrderIds: allSavedOrderIds,
				pushOrder,
				removeOrder,
				resetAllSavedOrders,
				isOrderExists
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
