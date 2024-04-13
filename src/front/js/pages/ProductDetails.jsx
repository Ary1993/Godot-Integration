import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';

export const ProductDetails = () => {
    const { store, actions } = useContext(Context)
    const params = useParams();
    const details = store.products.find(item => item.id == params.idProduct);

    if (!details) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container " style={{
            backgroundImage: 'url("")',
        }}>
            <h1 className="text-center mt-4">Details</h1>
            <div className="row">
                <div className="col-md-6" style={{ width: '300px' }}>
                    <div className="card border-dark my-3 mx-2 text-bg">
                        <img src={details.image_url} className="card-img-top" alt={details.name} />
                        <div className="card-body">
                            <h5 className="card-title">{details.name}</h5>
                            <p className='card-text'>
                                $ {details.price}.00
                            </p>
                        </div>

                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-dark my-3 mx-2 text-bg">
                        <div className="card-body">
                            <h5 className="card-title">Details</h5>
                            <p className="card-text">Price: {details.name}</p>
                            <p className="card-text">Price: ${details.price}</p>
                            <p className="card-text">Description: {details.description}</p>
                            {/* todos los parametros que quiera los pongo aqui */}
                             <Button variant="primary" >Primary</Button>{' '}
                            <Button variant="primary" >Secundary</Button>{' '} 




                        </div>
                       
                    </div>
                </div>

            </div>
        </div>
    );
}
