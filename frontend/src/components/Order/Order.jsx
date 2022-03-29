import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Order(props) {
	const { title, status, createdAt } = props.order;

	return (
		<div
			onClick={() => props.clickHandler()}
			className="mt-6 flex transform items-center rounded-lg border-2 border-indigo-300 bg-white p-4 shadow-md transition duration-300 hover:-translate-y-0.5 hover:cursor-pointer hover:shadow-lg"
		>
			<div className="flex w-9/12 flex-col pr-4">
				<p className="mb-2 text-lg font-black text-gray-700 sm:text-2xl">
					{title}
				</p>
				<p className=" text-base font-light leading-5 text-gray-600 sm:text-lg">
					{`Sent At: ${new Date(
						parseInt(createdAt)
					).toLocaleDateString("zh-HK")} - Status: ${status}`}
				</p>
			</div>
			<div className="flex w-3/12 justify-end">
				<button className="mr-2 flex items-center text-base text-gray-700 hover:text-indigo-500 sm:text-xl md:text-2xl lg:text-3xl">
					<span>Details</span>
					<ArrowForwardIcon className="ml-2"></ArrowForwardIcon>
				</button>
			</div>
		</div>
	);
}

export default Order;
