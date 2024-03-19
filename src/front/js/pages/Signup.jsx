import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const { store, actions } = useContext(Context);

    const handleSignup = async () => {
        const dataToSend = {
            email: email,
            password: password,
            nick_name: nickname,
        }
        const url = process.env.BACKEND_URL + "api/signup"
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        }
        const response = await fetch(url, options);
        if (!response.ok) {
            console.log("error: ", response.status, response.statusText);
            return
        }
        const data = await response.json()
        alert("Usuario Registrado Con Exito");
        actions.login();
        localStorage.setItem("token", data.access_token)
    }
    return (
        store.isLogin ? <Navigate to="/profile" /> :
            <div className="container mt-5">
                <h1 text-center> Formulario de registro </h1>
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" for="form3Example3">Email address</label>
                    <input type="email" id="form3Example3" value={email} onChange={(event) => setEmail(event.target.value)} className="form-control" />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" for="form3Example4">Password</label>
                    <input type="password" id="form3Example4" value={password} onChange={(event) => setPassword(event.target.value)} className="form-control" />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" for="form3Example3">Nick name</label>
                    <input type="text" id="form3Example3" value={nickname} onChange={(event) => setNickname(event.target.value)} className="form-control" />
                </div>
                <button data-mdb-ripple-init type="button" onClick={handleSignup} className="btn btn-primary btn-block mb-4">Registrarse</button>
            </div>
    )
}