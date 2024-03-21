import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context)
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to={store.isLogin ? "/" : "/login"}>
						<button className="btn btn-success" onClick={actions.logout}>
							{store.isLogin ? "Logout" : "Login"}
						</button>
					</Link>
					{!store.isLogin && (
						<Link to="/signup">
							<button className="btn btn-warning ms-2">
								Signup
							</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
