import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Context } from '../store/appContext';


export const Profile = () => {
    const { store, actions } = useContext(Context);

    return (
        !store.user ? <Navigate to="/login" /> :
            <div>
                <div className="card d-flex align-center" style={{ width: "18rem" }}>
                    <div className="card-body">
                        <h5 className="card-title">{store.user.nick_name}</h5>
                        <p className="card-text">Email: {store.user.email}</p>
                        <p className="card-text">ID: {store.user.id}</p>
                    </div>
                </div>
            </div>
    );

}