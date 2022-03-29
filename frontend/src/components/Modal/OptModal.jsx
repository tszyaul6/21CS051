import OptMap from "../Map/OptMap";
import { useState, useContext } from "react";
import { DriverContext } from "../../context/DriverContext";

function OptModal(props) {
	const { _id, title, sender, receiver, driver, status } = props.order;
	const driverContext = useContext(DriverContext);
	const [statusState, setStatusState] = useState(status);

	async function deliveringHandler() {
		const requestBody = {
			query: `
				mutation {
					deliveringOrder(orderId: "${_id}") {
						status
					}
				}
			`
		};

		const response = await fetch(process.env.REACT_APP_BACKEND_API, {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${driverContext.driver.token}`
			}
		});

		const updatedOrderRes = await response.json();

		setStatusState(() => updatedOrderRes.data.deliveringOrder.status);

		props.updateStatusHandler(
			_id,
			updatedOrderRes.data.deliveringOrder.status
		);
	}

	async function receiveHandler() {
		const requestBody = {
			query: `
				mutation {
					receiveOrder(orderId: "${_id}") {
						status
					}
				}	
			`
		};

		const response = await fetch(process.env.REACT_APP_BACKEND_API, {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${driverContext.driver.token}`
			}
		});

		const updatedOrderRes = await response.json();

		setStatusState(() => updatedOrderRes.data.status);

		props.receiveOrderHandler(_id, updatedOrderRes.data.status);
	}

	return (
		<>
			<div className="fixed inset-0 z-50 mx-auto flex max-w-6xl items-center justify-center overflow-y-scroll outline-none focus:outline-none">
				<div className="relative mx-auto h-5/6 min-w-full">
					{/*content*/}
					<div className="relative mx-auto flex flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
						{/*header*/}
						<div className="flex items-start justify-between rounded-t border-b border-solid border-gray-200 p-5">
							<h3 className="text-3xl font-semibold">{title}</h3>
						</div>
						{/*body*/}
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Sender Name:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{sender.name}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Sender Phone Number:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{sender.phone_no}
							</p>
						</div>
						<hr />
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Receiver Name:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{receiver.name}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Receiver Phone Number:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{receiver.phone_no}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Receiver Address:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{receiver.address}
							</p>
						</div>
						<hr />

						<div className="h-screen">
							<OptMap
								origin={driver.coordinates}
								dest={receiver.coordinates}
							></OptMap>
						</div>

						{/*footer*/}
						<div className="flex items-center justify-end rounded-b border-t border-solid border-gray-200 p-2">
							<button
								className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
								type="button"
								onClick={() => props.closeHandler()}
							>
								Close
							</button>

							{statusState === "accepted" && (
								<button
									className="mr-1 mb-1 rounded bg-orange-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-orange-600"
									type="button"
									onClick={() => {
										deliveringHandler();
									}}
								>
									Start Delivering
								</button>
							)}

							{statusState === "delivering" && (
								<button
									className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
									type="button"
									onClick={() => {
										receiveHandler();
									}}
								>
									Received
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="fixed inset-0 z-40 bg-black opacity-25"></div>
		</>
	);
}

export default OptModal;
