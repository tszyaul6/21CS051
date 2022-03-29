import { useState, useContext, useEffect } from "react";
import BigModal from "../../components/Modal/BigModal";
import Order from "../../components/Order/Order";
import { DriverContext } from "../../context/DriverContext";
import { UserContext } from "../../context/UserContext";

function Orders() {
	const driverContext = useContext(DriverContext);
	const userContext = useContext(UserContext);

	const [shownOrders, setShownOrders] = useState([]);
	const [isModalShown, setIsModalShown] = useState(false);
	const [clickedOrder, setClickedOrder] = useState({});

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

	function updateDriverHandler(id, driver) {
		const shownOrdersCopy = [...shownOrders];

		const updateIndex = shownOrdersCopy.findIndex(
			(currentOrder) => currentOrder._id === id
		);

		const updatedOrder = shownOrdersCopy[updateIndex];

		updatedOrder.driver = driver;

		shownOrdersCopy[updateIndex] = updatedOrder;

		setShownOrders(() => shownOrdersCopy);
	}

	useEffect(() => {
		let requestBody = {
			query: `
				query {
					ordersWithIdsArray(orderIds: ${JSON.stringify(userContext.allSavedOrderIds)}) {
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
						coordinates
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

		if (driverContext.driver.driverId) {
			requestBody = {
				query: `
				query {
					ordersWithoutReceived {
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
						coordinates
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
		}

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

			setShownOrders(
				ordersRes.data.orders ||
					ordersRes.data.ordersWithIdsArray ||
					ordersRes.data.ordersWithoutReceived
			);
		}

		fetchAllOrders();
	}, [driverContext, userContext]);

	return (
		<>
			<div className="layout">
				<div className="flex flex-col justify-start ">
					<h1 className="h1">All Orders</h1>
					<p className="p">Here are all the orders.</p>
					{shownOrders.map((order) => {
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
						<BigModal
							order={clickedOrder}
							closeHandler={() => {
								setIsModalShown(false);
								setClickedOrder({});
							}}
							updateStatusHandler={(id, status) => {
								updateStatusHandler(id, status);
							}}
							updateDriverHandler={(id, driver) => {
								updateDriverHandler(id, driver);
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default Orders;
