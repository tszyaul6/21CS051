function Modal(props) {
	return (
		<div className="fixed inset-0 z-10 overflow-y-auto">
			<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-40 text-center sm:block sm:p-0">
				{/* Backdrop */}
				<div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"></div>

				<span
					className="hidden sm:inline-block sm:h-screen sm:align-middle"
					aria-hidden="true"
				>
					&#8203;
				</span>

				<div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3
									className="text-lg font-medium leading-6 text-gray-900"
									id="modal-title"
								>
									{props.title}
								</h3>
								<div className="mt-2">{props.children}</div>
							</div>
						</div>
					</div>
					<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						{props.submitHandler && (
							<button
								type="button"
								className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
								onClick={props.submitHandler}
							>
								{props.confirmText}
							</button>
						)}
						<button
							type="button"
							className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
							onClick={props.closeModalHandler}
						>
							{props.closeText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Modal;
