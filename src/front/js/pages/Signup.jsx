import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import {useNavigate} from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const dataToSend = {
            email: email,
            password: password,
            nick_name: nickname,
            is_admin: false
        }
        const url = process.env.BACKEND_URL + "/api/signup"
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
        console.log(data)
        localStorage.setItem("token", data.access_token)
        actions.login(data);
        // Now update wishes
        //await actions.updateWishes(data);
    }
    return (
       
            <div className="container mt-5">
                <h1 className="text-center"> Formulario de registro </h1>
                <form onSubmit={handleSignup}>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example1">Email address</label>
                        <input type="email" id="form3Example1" value={email} onChange={(event) => setEmail(event.target.value)} className="form-control" />
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example4">Password</label>
                        <input type="password" id="form3Example4" value={password} onChange={(event) => setPassword(event.target.value)} className="form-control" />
                    </div>
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="form3Example3">Nick name</label>
                        <input type="text" id="form3Example3" value={nickname} onChange={(event) => setNickname(event.target.value)} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mb-4">Registrarse</button>
                </form>

            </div>
    )
}