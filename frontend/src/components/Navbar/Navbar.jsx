import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import "./Navbar.css";

import { useContext } from "react";
import { DriverContext } from "../../context/DriverContext";

function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const driverContext = useContext(DriverContext);
	const navigate = useNavigate();

	let hamburgerHandler = () => {
		setMobileMenuOpen((prev) => !prev);
	};

	function logoutHandler(event) {
		event.preventDefault();
		setMobileMenuOpen(false);
		driverContext.logout();
		navigate("/login");
	}

	return (
		<nav className="mb-2 bg-white shadow-md">
			<div className="mx-auto max-w-6xl px-4">
				<div className="flex justify-between">
					{/* Logo and Primary Menu */}
					<div className="flex space-x-7">
						{/* Logo */}
						<div>
							<NavLink
								to="/"
								className="flex items-center px-2 py-4"
							>
								<LocalShippingIcon className="mr-2 h-8 w-8 text-indigo-500"></LocalShippingIcon>
								<span className="text-lg font-semibold text-gray-900">
									TY{" "}
									<span className="text-indigo-500">
										Express
									</span>
								</span>
							</NavLink>
						</div>

						{/* Primary menu */}
						<div className="hidden items-center space-x-1 md:flex">
							<NavLink
								to="/orders"
								// FIXME: Active class CSS not working
								className={({ isActive }) =>
									isActive ? "navlink_active" : "navlink"
								}
							>
								{!driverContext.driver.driverId
									? "My Orders"
									: "All Customer Orders"}
							</NavLink>
							{driverContext.driver.driverId && (
								<NavLink
									to="/optorders"
									className={({ isActive }) =>
										isActive ? "navlink_active" : "navlink"
									}
								>
									Optimized Orders
								</NavLink>
							)}
							{!driverContext.driver.driverId && (
								<NavLink
									to="/receive"
									className={({ isActive }) =>
										isActive ? "navlink_active" : "navlink"
									}
								>
									Receive Packages
								</NavLink>
							)}
							{!driverContext.driver.driverId && (
								<NavLink
									to="/send"
									className={({ isActive }) =>
										isActive ? "navlink_active" : "navlink"
									}
								>
									Send Packages
								</NavLink>
							)}
						</div>
					</div>

					{/* Secondary menu */}
					<div className="spacex-x-3 hidden items-center md:flex">
						{!driverContext.driver.driverId && (
							<NavLink
								to="/login"
								className="hover:text-whihte rounded px-2 py-2 font-medium text-gray-900 transition duration-300 hover:bg-indigo-500 hover:text-white"
							>
								Staff Login
							</NavLink>
						)}
						{driverContext.driver.driverId && (
							<button
								onClick={logoutHandler}
								className="hover:text-whihte rounded px-2 py-2 font-medium text-gray-900 transition duration-300 hover:bg-indigo-500 hover:text-white"
							>
								Log Out
							</button>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="flex items-center md:hidden">
						<button
							className="mobile-menu-button outline-none"
							onClick={hamburgerHandler}
						>
							<MenuIcon className="h-6 w-6 text-gray-900"></MenuIcon>
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				<div
					className={`${
						mobileMenuOpen ? "" : "hidden"
					} mobile-menu md:hidden`}
				>
					<ul>
						<li>
							<NavLink
								to="/orders"
								className={({ isActive }) =>
									isActive
										? "mobile_navlink_active"
										: "mobile_navlink"
								}
								onClick={hamburgerHandler}
							>
								{!driverContext.driver.driverId
									? "My Orders"
									: "All Customer Orders"}
							</NavLink>
						</li>
						{driverContext.driver.driverId && (
							<li>
								<NavLink
									to="/optorders"
									className={({ isActive }) =>
										isActive
											? "mobile_navlink_active"
											: "mobile_navlink"
									}
									onClick={hamburgerHandler}
								>
									Optimized Order
								</NavLink>
							</li>
						)}
						{!driverContext.driver.driverId && (
							<li>
								<NavLink
									to="/receive"
									className={({ isActive }) =>
										isActive
											? "mobile_navlink_active"
											: "mobile_navlink"
									}
									onClick={hamburgerHandler}
								>
									Receive Packages
								</NavLink>
							</li>
						)}
						{!driverContext.driver.driverId && (
							<li>
								<NavLink
									to="/send"
									className={({ isActive }) =>
										isActive
											? "mobile_navlink_active"
											: "mobile_navlink"
									}
									onClick={hamburgerHandler}
								>
									Send Packages
								</NavLink>
							</li>
						)}
						{!driverContext.driver.driverId && (
							<li>
								<NavLink
									to="/login"
									className={({ isActive }) =>
										isActive
											? "mobile_navlink_active"
											: "mobile_navlink"
									}
									onClick={hamburgerHandler}
								>
									Staff Login
								</NavLink>
							</li>
						)}
						{driverContext.driver.driverId && (
							<li>
								<button
									onClick={logoutHandler}
									className="mobile_navlink w-full text-left"
								>
									Logout
								</button>
							</li>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
