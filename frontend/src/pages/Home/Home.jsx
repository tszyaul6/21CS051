import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./Home.css";

function Home() {
	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className="flex flex-col space-y-2">
				<h1 className="h1">
					Fast and Simple - TY{" "}
					<span className="text-indigo-500">Express</span>
				</h1>
				<p className="p">
					TY Express is a web-based solution providing fast and simple
					services like sending, receiving or tracking packages. Try
					it now!
				</p>
				<Link className="home_btn" to="/orders">
					View my orders
					<ArrowForwardIosIcon />
				</Link>
				<Link className="home_btn" to="/receive">
					Receive Packages
					<ArrowForwardIosIcon />
				</Link>
				<Link className="home_btn" to="/send">
					Send Packages
					<ArrowForwardIosIcon />
				</Link>
			</div>
		</div>
	);
}
export default Home;
