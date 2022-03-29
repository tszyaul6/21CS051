import { useRef, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { DriverContext } from "../../context/DriverContext";
import { UserContext } from "../../context/UserContext";

function Login() {
	const driverContext = useContext(DriverContext);
	const userContext = useContext(UserContext);
	const navigate = useNavigate();

	const [isLogin, setIsLogin] = useState(true);
	const [isLoginError, setIsLoginError] = useState(false);
	const [isRegisterError, setIsRegisterError] = useState(false);
	const [isDriverExists, setIsDriverExists] = useState(false);
	const [isModalShown, setIsModalShown] = useState(false);

	const emailRef = useRef("");
	const nameRef = useRef("");
	const phone_noRef = useRef("");
	const passwordRef = useRef("");

	function switchModeHandler(event) {
		event.preventDefault();

		setIsLoginError(false);
		setIsLogin((prevState) => !prevState);
	}

	function closeModalHandler(event) {
		event.preventDefault();
		setIsModalShown(false);
	}

	async function submitHandler(event) {
		event.preventDefault();

		const email = emailRef.current.value.trim();
		const password = passwordRef.current.value.trim();

		if (email === "" || password === "") return;

		if (
			!email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			isLogin ? setIsLoginError(true) : setIsRegisterError(true);
			return;
		}

		// request body for login
		let requestBody = {
			query: `
			query {
				driverLogin(email: "${email}", password: "${password}") {
					driverId
					token
					expiration
				}
			  }
			`
		};

		// request body for register
		if (!isLogin) {
			const name = nameRef.current.value.trim();
			const phone_no = phone_noRef.current.value.trim();

			if (name === "" || phone_no === "") return;

			if (
				!Number.isInteger(parseInt(phone_no)) ||
				parseInt(phone_no) <= 0 ||
				phone_no.length !== 8
			) {
				setIsRegisterError(true);
				return;
			}

			requestBody = {
				query: `
				mutation{
					createDriver(driverInput: {name: "${name}", phone_no: "${phone_no}", email: "${email}", password: "${password}" }) {
						_id
					}
				}
				`
			};
		}

		const response = await fetch(process.env.REACT_APP_BACKEND_API, {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const driverResponse = await response.json();

		const errorMsg = driverResponse.errors?.[0]?.message;

		errorMsg === "Incorrect password" || errorMsg === "Driver not found"
			? setIsLoginError(true)
			: setIsLoginError(false);

		if (errorMsg === "Driver exists") {
			setIsDriverExists(true);
			return;
		}

		// handling what to do after sign up / login
		// signup: just pop up a message said it is signed up
		// login: save the driver data to the context and redirect to orders page
		if (!errorMsg) {
			setIsLoginError(false);
			setIsRegisterError(false);
			setIsDriverExists(false);

			if (!isLogin) {
				setIsModalShown(true);
				setIsLogin(true);
			} else {
				driverContext.login(
					driverResponse.data.driverLogin.token,
					driverResponse.data.driverLogin.driverId
				);
				userContext.resetAllSavedOrders();
				navigate("/orders");
			}
		}
	}

	return (
		<div className="layout">
			<h1 className="h1">
				{isLogin ? "Staff Login" : "Create an account"}
			</h1>
			<p className="p mb-6">
				{isLogin
					? "Please login to use staff mode"
					: "Please fill in the followings to create an account"}
			</p>
			<form className="mb-4 rounded bg-white px-8 pt-6 pb-8 shadow-md">
				{!isLogin && (
					<>
						<div className="mb-4">
							<label
								className="mb-2 block text-sm font-bold text-gray-700"
								htmlFor="name"
							>
								Name
							</label>
							<input
								className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
								id="email"
								type="text"
								placeholder="Name"
								ref={nameRef}
							/>
						</div>
						<div className="mb-4">
							<label
								className="mb-2 block text-sm font-bold text-gray-700"
								htmlFor="phone_no"
							>
								Phone Number
							</label>
							<input
								className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
								id="phone_no"
								type="text"
								placeholder="Phone Number"
								ref={phone_noRef}
							/>
						</div>
					</>
				)}
				<div className="mb-4">
					<label
						className="mb-2 block text-sm font-bold text-gray-700"
						htmlFor="email"
					>
						Email
					</label>
					<input
						className={
							isLoginError
								? "focus:shadow-outline w-full appearance-none rounded border border-red-500 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
								: "focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
						}
						id="email"
						type="text"
						placeholder="Email"
						ref={emailRef}
					/>
				</div>
				<div className="mb-6">
					<label
						className="mb-2 block text-sm font-bold text-gray-700"
						htmlFor="password"
					>
						Password
					</label>
					<input
						className={
							isLoginError
								? "focus:shadow-outline w-full appearance-none rounded border border-red-500 py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
								: "focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
						}
						id="password"
						type="password"
						placeholder="Password"
						ref={passwordRef}
					/>
					{isLoginError && (
						<p className="mt-2 text-xs italic text-red-500">
							Email / Password Incorrect.
						</p>
					)}
					{isRegisterError && (
						<p className="mt-2 text-xs italic text-red-500">
							Format of Email / Phone Number Incorrect.
						</p>
					)}
					{isDriverExists && (
						<p className="mt-2 text-xs italic text-red-500">
							Driver Exists
						</p>
					)}
				</div>
				<div className="flex items-center justify-between">
					<button
						className="focus:shadow-outline rounded bg-indigo-500 py-2 px-4 font-bold text-white hover:bg-indigo-700 focus:outline-none"
						type="submit"
						onClick={submitHandler}
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</button>
					<button
						onClick={switchModeHandler}
						type="button"
						className="inline-block align-baseline text-sm font-bold text-indigo-500 hover:text-indigo-800"
					>
						{isLogin
							? "Create an account"
							: "Sign in with existed account"}
					</button>
				</div>
			</form>

			{isModalShown && (
				<Modal
					title="Success"
					closeText="Close"
					closeModalHandler={closeModalHandler}
				>
					<div className="text-sm text-gray-500">
						Account Registered Successfully.
					</div>
				</Modal>
			)}
		</div>
	);
}

export default Login;
