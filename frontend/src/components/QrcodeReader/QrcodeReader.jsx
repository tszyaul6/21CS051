import { useState } from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";

const QrcodeReader = (props) => {
	const [orderId, setOrderId] = useState("No result");

	return (
		<div className="flex w-full flex-col">
			<QrReader
				onResult={(result, error) => {
					if (!!result) {
						setOrderId(result?.text);
						props.fetchOrder(result?.text);
						props.afterScannedHandler();
					}
				}}
			/>
			<p>{orderId}</p>
		</div>
	);
};

export default QrcodeReader;
