import { useContext, useEffect, useState } from "react";
import OptModal from "../../components/Modal/OptModal";
import Order from "../../components/Order/Order";
import { DriverContext } from "../../context/DriverContext";

function OptOrders() {
	const driverContext = useContext(DriverContext);

	const [isLoading, setIsLoading] = useState(true);
	const [shownOrders, setShownOrders] = useState([]);
	const [isModalShown, setIsModalShown] = useState(false);
	const [clickedOrder, setClickedOrder] = useState({});

	useEffect(() => {
		let requestBody = {
			query: `
				query {
					optOrders(driverId: "${driverContext.driver.driverId}") {
					  _id
					  title
					  sender {
						name
						phone_no
					  }
					  receiver {
						name
						phone_no
						address
						coordinates
					  }
					  driver {
						  _id
						coordinates
					  }
					  status
					  createdAt
					}
				  }
			`
		};

		async function fetchAllOrders() {
			const response = await fetch(process.env.REACT_APP_BACKEND_API, {
				method: "POST",
				body: JSON.stringify(requestBody),
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + driverContext.driver.token
				}
			});

			const ordersRes = await response.json();

			setShownOrders(ordersRes?.data?.optOrders || []);

			setIsLoading(false);
		}

		fetchAllOrders();
	}, [driverContext]);

	function updateStatusHandler(id, status) {
		const shownOrdersCopy = [...shownOrders];

		const updateIndex = shownOrdersCopy.findIndex(
			(currentOrder) => currentOrder._id === id
		);

		const updatedOrder = shownOrdersCopy[updateIndex];

		updatedOrder.status = status;

		shownOrdersCopy[updateIndex] = updatedOrder;

		setShownOrders(() => shownOrdersCopy);
	}

	function receiveOrderHandler(id, status) {
		const shownOrdersCopy = [...shownOrders];

		const updatedOrders = shownOrdersCopy.filter(
			(order) => order._id !== id
		);

		setShownOrders(() => updatedOrders);
	}

	return (
		<>
			<div className="layout">
				<div className="flex flex-col justify-start ">
					<h1 className="h1">Optimized Orders</h1>
					<p className="p">Here are all the optimized orders.</p>
					{isLoading && <p className="p">Loading, please wait...</p>}

					{shownOrders.length > 0 &&
						shownOrders.map((order) => {
							return (
								<Order
									key={order._id}
									order={order}
									clickHandler={() => {
										setIsModalShown(true);
										setClickedOrder(order);
									}}
								/>
							);
						})}

					{isModalShown && (
						<OptModal
							order={clickedOrder}
							closeHandler={() => {
								setIsModalShown(false);
								setClickedOrder({});
							}}
							updateStatusHandler={(id, status) => {
								updateStatusHandler(id, status);
							}}
							receiveOrderHandler={(id, status) => {
								receiveOrderHandler(id, status);
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default OptOrders;
