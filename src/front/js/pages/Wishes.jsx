import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Context } from '../store/appContext';


export const Wishes = () => {
    const { store, actions } = useContext(Context);
    return (
        
        <div>
            <div className="card d-flex align-center" style={{ width: "18rem" }}>
                <div className="card-body">
                    <p className="card-text">ID: {store.Wishes.id}</p>
                </div>
            </div>
        </div>
    );

}