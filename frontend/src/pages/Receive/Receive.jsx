import QrcodeReader from "../../components/QrcodeReader/QrcodeReader";
import { useRef, useState } from "react";
import BigModal from "../../components/Modal/BigModal";

function Receive() {
	const [isReaderOpen, setIsReaderOpen] = useState(false);
	const [isModalShown, setIsModalShown] = useState(false);
	const [fetchedOrder, setFetchedOrder] = useState({});

	const orderIdInputRef = useRef("");

	const fetchOrder = async (orderId) => {
		let requestBody = {
			query: `
				query {
					order(id: "${orderId}") {
						_id
						title
						description
						sender {
						  name
						  phone_no
						  email
						}
						receiver {
						  name
						  phone_no
						  email
						  address
						}
						isPaidBySender
						driver {
						  name
						  phone_no
						  coordinates
						  location
						}
						status
						eta
						createdAt
						updatedAt
					}
				}	
			`
		};

		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_API, {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json"
				}
			});

			const orderResponse = await response.json();

			if (!orderResponse.data) {
				throw new Error("Incorrect Order ID");
			}

			setFetchedOrder(orderResponse?.data?.order);
			setIsModalShown(true);
		} catch (err) {
			console.log(err);
		}
	};

	function toggleReaderHandler() {
		setIsReaderOpen((prevState) => !prevState);
	}

	return (
		<div className="layout">
			<div className="flex flex-col justify-start">
				<h1 className="h1">Instruction</h1>
				<p className="p">
					You can add a receiving order by inserting the order id in
					the input box or scan the QR code to and start tracking the
					location.
				</p>
			</div>

			<div className="flex space-x-2">
				<div className="flex w-1/2 flex-auto items-center border-b border-indigo-500 py-2">
					<input
						className="mr-3 w-full py-1 px-2 leading-tight text-gray-700 focus:outline-none"
						type="text"
						placeholder="Order ID"
						ref={orderIdInputRef}
					/>
					<button
						className="flex-shrink-0 rounded border-4 border-indigo-500 bg-indigo-500 py-1 px-2 text-sm text-white hover:border-indigo-700 hover:bg-indigo-700"
						type="button"
						onClick={() => {
							fetchOrder(orderIdInputRef.current.value);
							orderIdInputRef.current.value = "";
						}}
					>
						Search
					</button>
				</div>

				<button
					type="button"
					className="mt-6 flex w-1/2 flex-auto transform items-center rounded-full border-2 border-indigo-300 px-4 py-2 text-center font-bold text-gray-500 shadow-md hover:-translate-y-0.5 hover:text-indigo-500"
					onClick={toggleReaderHandler}
				>
					{isReaderOpen
						? "Close QR Code Reader"
						: "Open QR Code Reader"}
				</button>
			</div>

			{isReaderOpen && (
				<QrcodeReader
					fetchOrder={(orderId) => fetchOrder(orderId)}
					afterScannedHandler={() => {
						toggleReaderHandler();
					}}
				/>
			)}

			{isModalShown && (
				<BigModal
					order={fetchedOrder}
					closeHandler={() => setIsModalShown(false)}
				/>
			)}
		</div>
	);
}

export default Receive;
