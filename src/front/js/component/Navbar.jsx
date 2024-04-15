import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { BTNWishes } from "./BTNWishes.jsx";
import logo from "../../img/logo.png";

export const Navbar = () => {
	const { store, actions } = useContext(Context)
	return (
		<nav className="navbar ">
			<div className="container">
			
					<Link to="/" className="d-flex align-items-center">
						<img src={logo} alt="Logo" className="navbar-brand-logo" style={{ width: '100px', height: 'auto', marginRight: '20px' }} />
						<h3>NextLevel Keys</h3> 

					</Link>
				
				<div className="ml-auto">
					<Link to={store.isLogin ? "/" : "/login"}>
						<button className="btn btn-success ms-2" onClick={store.isLogin ? actions.logout : () => { }}>
							{store.isLogin ? "Logout" : "Login"}
						</button>
					</Link>
					<BTNWishes />
					{!store.isLogin && (
						<Link to="/signup">
							<button className="btn btn-warning ms-2">
								Signup
							</button>
						</Link>
					)}
					{store.isLogin && (
						<Link to="/cart">
							<button className="btn btn-danger ms-2">
								Carrito
							</button>
						</Link>
					)}
					{store.isLogin && (
						<Link to="/profile">
							<button className="btn btn-info ms-2">
								Profile
							</button>
						</Link>
					)}
				</div>

			</div>
		</nav>
	);
};
