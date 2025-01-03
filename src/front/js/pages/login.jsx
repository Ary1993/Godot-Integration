import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const { store, actions } = useContext(Context)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleOnClick = async () => {
        const dataToSend = {
            email: email,
            password: password
        }
        await actions.handleLogin(dataToSend.email,dataToSend.password);
    }


    return (
        store.isLogin ? <Navigate to="/profile" /> :
            <div className="card-body py-5 px-md-5">
                <h1 className="text-center">Login</h1>
                <div className="form-outline mb-4">
                    <input type="email" id="form2Example1" className="form-control"
                        value={email} onChange={(event) => setEmail(event.target.value)} />
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                </div>
                <div className="form-outline mb-4">
                    <input type="password" id="form2Example2" className="form-control"
                        value={password} onChange={(event) => setPassword(event.target.value)} />
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                </div>
                <div>
                    <button onClick={handleOnClick} type="button" className="btn btn-primary btn-block mb-4">Login</button>
                </div>
            </div>
    )
}