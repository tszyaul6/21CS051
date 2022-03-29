import { useEffect, useState } from "react";
import { useContext } from "react";
import { DriverContext } from "../../context/DriverContext";
import { UserContext } from "../../context/UserContext";
import OptMap from "../Map/OptMap";

function BigModal(props) {
	const userContext = useContext(UserContext);
	const driverContext = useContext(DriverContext);

	async function acceptHandler(orderId) {
		const requestBody = {
			query: `
				mutation {
					acceptOrder(driverId: "${driverContext.driver.driverId}", orderId: "${orderId}") {
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

		setStatusState(updatedOrderRes.data.acceptOrder.status);
	}

	const {
		_id,
		title,
		description,
		sender,
		receiver,
		isPaidBySender,
		driver,
		status,
		createdAt
	} = props.order;

	const [statusState, setStatusState] = useState(status);
	const [eta, setEta] = useState("");
	const [driverState] = useState(driver);

	useEffect(() => {
		async function getEta() {
			if (status === "delivering") {
				let requestBody = {
					query: `
				query {
					calculateEta(orderId: "${_id}")
				}
			`
				};
				const response = await fetch(
					process.env.REACT_APP_BACKEND_API,
					{
						method: "POST",
						body: JSON.stringify(requestBody),
						headers: {
							"Content-type": "application/json"
						}
					}
				);
				const result = await response.json();

				if (result.data) {
					setEta(() => result.data.calculateEta);
				}
			}
		}
		getEta();
	}, [_id, status]);

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
								Description:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{description}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Package Status:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{statusState}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								This order is sent at:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{new Date(
									parseInt(createdAt)
								).toLocaleDateString("zh-HK")}
							</p>
						</div>
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Estimated Arrivat Time:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{eta || "Not yet available."}
							</p>
						</div>
						<hr />
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
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Sender Email:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{sender.email}
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
								Receiver Email:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{receiver.email}
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
						<div className="flex flex-auto p-2">
							<p className="text-lg text-gray-700 ">
								Freight Paid By:
							</p>
							<p className="ml-2 text-lg text-gray-500 ">
								{isPaidBySender
									? `Sender (${sender.name})`
									: `Receiver (${receiver.name})`}
							</p>
						</div>
						<hr />
						{status === "delivering" && (
							<>
								<div className="flex flex-auto p-2">
									<p className="text-lg text-gray-700 ">
										Driver Name:
									</p>
									<p className="ml-2 text-lg text-gray-500 ">
										{driverState?.name ||
											"Not assigned yet"}
									</p>
								</div>
								<div className="flex flex-auto p-2">
									<p className="text-lg text-gray-700 ">
										Driver Phone Number:
									</p>
									<p className="ml-2 text-lg text-gray-500 ">
										{driverState?.phone_no ||
											"Not assigned yet"}
									</p>
								</div>
								<div className="flex flex-auto p-2">
									<p className="text-lg text-gray-700 ">
										Driver is near:
									</p>
									<p className="ml-2 text-lg text-gray-500 ">
										{driverState?.location ||
											"Not assigned yet"}
									</p>
								</div>
								<hr />

								<div className="h-screen">
									<OptMap
										origin={driver.coordinates}
										dest={receiver.coordinates}
									></OptMap>
								</div>
							</>
						)}

						{/*footer*/}
						<div className="flex items-center justify-end rounded-b border-t border-solid border-gray-200 p-2">
							<button
								className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
								type="button"
								onClick={() => props.closeHandler()}
							>
								Close
							</button>
							{!userContext.isOrderExists(_id) &&
								!driverContext.driver.driverId && (
									<button
										className="mr-1 mb-1 rounded bg-indigo-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-indigo-600"
										type="button"
										onClick={() => {
											userContext.pushOrder(
												props.order._id
											);
										}}
									>
										Save to my orders
									</button>
								)}
							{userContext.isOrderExists(_id) &&
								!driverContext.driver.driverId && (
									<button
										className="mr-1 mb-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
										type="button"
										onClick={() => {
											userContext.removeOrder(_id);
										}}
									>
										Remove from my orders
									</button>
								)}

							{driverContext.driver.driverId &&
								status === "placed" && (
									<button
										className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
										type="button"
										onClick={() => {
											acceptHandler(_id);
											props.updateStatusHandler(
												_id,
												"accepted"
											);
										}}
									>
										Accept this order
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

export default BigModal;
