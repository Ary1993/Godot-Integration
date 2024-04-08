import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";



export const ProductDetails = () => {
    const { store, actions } = useContext(Context)
    const params = useParams();
    //const details = store.users.filter((item) => item.id == params.idContact)
    //console.log(id)
    const details = store.products.filter((item) => item.id == params.idProduct)
    console.log(details)
    return (
        <div className="container">
            <h1 className="text-center">Details</h1>
            {!details ? "" :
                <div className="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-2">
                        <div key={details[0].id}>
                            <div className="col">
                                <div className="card border-dark my-3 mx-2 text-bg-dark">
                                    <img src={details[0].image_url} className="card-img-top" alt={details[0].name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{details[0].name}</h5>
                                        <p className='card-text'>
                                            ID: {details[0].id}
                                            <br />
                                            ${details[0].price}.00
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span onClick={() => { favoriteTask(details[0]) }} className="btn btn-outline-warning">
                                            <i className="fas fa-heart text-warning"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
            </div>
            }
        </div>
    )

}