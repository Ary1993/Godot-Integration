import React, { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Context } from '../store/appContext';



export const Products = () => {
    const { store, actions } = useContext(Context);
    return (
        <div className="container">
            <h1 className="mb-4">Products List</h1>
            {!store.products ? <h2>Loading...</h2> :
                <div className="card-columns">
                    {store.products.map((products) => (
                        <div key={products.id} className="card">
                            <img src={products.image_url} className="card-img-top" alt={products.name} />
                            <div className="card-body">
                                <h5 className="card-title">{products.name}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    );

}