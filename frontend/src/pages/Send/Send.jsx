import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import "./Send.css";

function Send() {
	const [isModalShown, setIsModalShown] = useState(false);
	const [isErrorModalShown, setIsErrorModalShown] = useState("");
	const [formErrorDetails, setFormErrorDetails] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const navigate = useNavigate();

	const titleRef = useRef();
	const descriptionRef = useRef();
	const s_nameRef = useRef();
	const s_phone_noRef = useRef();
	const s_emailRef = useRef();
	const r_nameRef = useRef();
	const r_phone_noRef = useRef();
	const r_emailRef = useRef();
	const r_addressRef = useRef();
	const isPaidBySenderRef = useRef();

	function checkAndShowModalHandler(event) {
		event.preventDefault();

		const title = titleRef.current.value.trim();
		const description = descriptionRef.current.value.trim();
		const s_name = s_nameRef.current.value.trim();
		const s_phone_no = s_phone_noRef.current.value.trim();
		const s_email = s_emailRef.current.value.trim();
		const r_name = r_nameRef.current.value.trim();
		const r_phone_no = r_phone_noRef.current.value.trim();
		const r_email = r_emailRef.current.value.trim();
		const r_address = r_addressRef.current.value.trim();

		if (
			title === "" ||
			description === "" ||
			s_name === "" ||
			s_phone_no === "" ||
			s_email === "" ||
			r_name === "" ||
			r_phone_no === "" ||
			r_email === "" ||
			r_address === ""
		) {
			setFormErrorDetails(
				"There is something missing in your form, all fields are required."
			);
			setIsErrorModalShown(true);
		} else if (
			!s_email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			) ||
			!r_email.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
		) {
			setFormErrorDetails("The format of the email is not correct.");
			setIsErrorModalShown(true);
		} else if (
			!Number.isInteger(parseInt(s_phone_no)) ||
			!Number.isInteger(parseInt(r_phone_no)) ||
			parseInt(s_phone_no) <= 0 ||
			parseInt(r_phone_no) <= 0 ||
			s_phone_no.length !== 8 ||
			r_phone_no.length !== 8
		) {
			setFormErrorDetails(
				"The format of the phone number is not correct"
			);
			setIsErrorModalShown(true);
		} else {
			setIsModalShown(true);
		}
	}

	function closeSubmittedModalHandler(event) {
		event.preventDefault();
		setIsSubmitted(false);
		navigate("/");
	}

	function closeErrorModalHandler(event) {
		event.preventDefault();
		setIsErrorModalShown(false);
	}

	function closeModalHandler(event) {
		event.preventDefault();
		setIsModalShown(false);
	}

	async function submitHandler(event) {
		event.preventDefault();

		const title = titleRef.current.value.trim();
		const description = descriptionRef.current.value.trim();
		const s_name = s_nameRef.current.value.trim();
		const s_phone_no = s_phone_noRef.current.value.trim();
		const s_email = s_emailRef.current.value.trim();
		const r_name = r_nameRef.current.value.trim();
		const r_phone_no = r_phone_noRef.current.value.trim();
		const r_email = r_emailRef.current.value.trim();
		const r_address = r_addressRef.current.value.trim();
		const isPaidBySender = isPaidBySenderRef.current.checked;

		let requestBody = {
			query: `
			mutation {
				createOrder(orderInput: {title: "${title}", description: "${description}", sender: {name: "${s_name}", phone_no: "${s_phone_no}", email: "${s_email}", address:"sender"}, receiver: {name: "${r_name}", phone_no: "${r_phone_no}", email: "${r_email}", address: "${r_address}"}, isPaidBySender: ${isPaidBySender}}) {
				  _id
				  title
				  description
				  sender {
					name
				  }
				  receiver {
					name
				  }
				  freight
				  isPaidBySender
				  driver {
					name
				  }
				  status
				  eta
				  createdAt
				  updatedAt
				}
			  }
			`
		};

		const response = await fetch(process.env.REACT_APP_BACKEND_API, {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const createdOrder = await response.json();

		setIsModalShown(false);

		let emailBody = {
			query: `
			query {
				sendEmail(id: "${createdOrder.data.createOrder._id}") {
					_id
				}
			}
			`
		};

		await fetch(process.env.REACT_APP_BACKEND_API, {
			method: "POST",
			body: JSON.stringify(emailBody),
			headers: {
				"Content-Type": "application/json"
			}
		});

		setIsSubmitted(true);
	}

	return (
		<div className="layout">
			<h1 className="h1">Instruction</h1>
			<p className="p">
				Please fill in the following form to send a package. All of the
				followings are required.
			</p>

			<form className="mt-6 w-full">
				{/* Title */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="title">
							Title
						</label>
						<input
							ref={titleRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="title"
							type="text"
							placeholder="Title of this order"
						/>
					</div>
				</div>

				{/* Description */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="description">
							Description
						</label>
						<input
							ref={descriptionRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="description"
							type="text"
							placeholder="Description of this order"
						/>
					</div>
				</div>

				<hr className="mb-6" />

				{/* Sender Name */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="s_name">
							Sender - Name
						</label>
						<input
							ref={s_nameRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="s_name"
							type="text"
							placeholder="Name of the sender"
						/>
					</div>
				</div>

				{/* Sender Phone Number */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="s_phone_no">
							Sender - Phone Number
						</label>
						<input
							ref={s_phone_noRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="s_phone_no"
							type="tel"
							placeholder="Phone number of the sender"
						/>
					</div>
				</div>

				{/* Sender Email */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="s_email">
							Sender - Email
						</label>
						<input
							ref={s_emailRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="s_email"
							type="text"
							placeholder="Email of the sender"
						/>
					</div>
				</div>

				<hr className="mb-6" />

				{/* Receiver Name */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="r_name">
							Receiver - Name
						</label>
						<input
							ref={r_nameRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="r_name"
							type="text"
							placeholder="Name of the receiver"
						/>
					</div>
				</div>

				{/* Receiver Phone Number */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="r_phone_no">
							Receiver - Phone Number
						</label>
						<input
							ref={r_phone_noRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="r_phone_no"
							type="tel"
							placeholder="Phone number of the receiver"
						/>
					</div>
				</div>

				{/* Receiver Email */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="r_email">
							Receiver - Email
						</label>
						<input
							ref={r_emailRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="r_email"
							type="text"
							placeholder="Email of the receiver"
						/>
					</div>
				</div>

				{/* Receiver Address */}
				<div className="-mx-3 mb-6 flex flex-wrap">
					<div className="w-full px-3">
						<label className="form-label" htmlFor="r_address">
							Receiver - Address
						</label>
						<input
							ref={r_addressRef}
							className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-100 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
							id="r_address"
							type="text"
							placeholder="Address of the receiver"
						/>
					</div>
				</div>

				<hr className="mb-6" />

				{/* Freight charges paid by */}
				<div>
					<label className="block font-bold text-gray-500">
						<input
							ref={isPaidBySenderRef}
							className="mr-2 leading-tight"
							type="checkbox"
						/>
						<span className="text-sm">
							I (the sender) will pay the freight.
						</span>
					</label>
				</div>
				<p className="form-reminder mb-6">
					If you don't check this box, the freight will be paid by the
					receiver.
				</p>

				<div className="flex">
					<button
						type="submit"
						className="mr-3 flex-shrink-0 rounded border-4 border-indigo-500 bg-indigo-500 py-1 px-2 text-sm text-white hover:border-indigo-700 hover:bg-indigo-700"
						onClick={checkAndShowModalHandler}
					>
						Send
					</button>
					<button
						className="flex-shrink-0 rounded border-4 border-transparent py-1 px-2 text-sm text-indigo-500 hover:text-indigo-800"
						type="reset"
					>
						Reset
					</button>
				</div>
			</form>

			{isErrorModalShown && (
				<Modal
					title="There is something wrong with your form"
					closeText="Close"
					closeModalHandler={closeErrorModalHandler}
				>
					<div className="text-sm text-gray-500">
						{formErrorDetails}
					</div>
				</Modal>
			)}

			{isModalShown && (
				<Modal
					title="Press Confirm to submit the order"
					closeText="Close"
					confirmText="Confirm"
					closeModalHandler={closeModalHandler}
					submitHandler={submitHandler}
				>
					<div className="text-sm text-gray-500">
						Please ensure all filled records are correct. Once the
						order is submitted, it cannot be changed.
					</div>
				</Modal>
			)}

			{isSubmitted && (
				<Modal
					title="Success"
					closeText="Close"
					closeModalHandler={closeSubmittedModalHandler}
				>
					<div className="text-sm text-gray-500">
						The order is accepted. Please check your email and see
						the details.
					</div>
				</Modal>
			)}
		</div>
	);
}

export default Send;
