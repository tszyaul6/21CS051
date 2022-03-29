import { useState } from "react";

const useLocalStorage = (lsKey, initialValue) => {
	const [lsValue, setUpdatedLsValue] = useState(
		localStorage.getItem(lsKey)
			? JSON.parse(localStorage.getItem(lsKey))
			: initialValue
	);

	const setLsValue = (updatedLsValue) => {
		localStorage.setItem(lsKey, updatedLsValue);
		let parsedUpdatedLsValue = JSON.parse(updatedLsValue);
		setUpdatedLsValue(parsedUpdatedLsValue);
	};

	return [lsValue, setLsValue];
};

export default useLocalStorage;
