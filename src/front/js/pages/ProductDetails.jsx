import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProductDetails = () => {
    const { store, actions } = useContext(Context)
    const params = useParams();
    const details = store.products.find(item => item.id == params.idProduct);

    if (!details) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container" style={{ backgroundImage: 'url("https://media.gettyimages.com/id/1401785136/es/foto/primer-plano-de-una-joven-asi%C3%A1tica-jugando-a-la-consola-de-videojuegos-en-la-sala-de-estar-de.jpg?s=612x612&w=0&k=20&c=WvUUx6-uLsWWeqo28Wk-k9anJqOUib1TW56jW2HEjJY=")',
        }}>
            <h1 className="text-center">Details</h1>
            <div className="row">
                <div className="col-md-6" style={{ width: '300px'}}>
                    <div className="card border-dark my-3 mx-2 text-bg-dark">
                        <img src={details.image_url} className="card-img-top" alt={details.name}  />
                        <div className="card-body">
                            <h5 className="card-title">{details.name}</h5>
                            <p className='card-text'>
                                $ {details.price}.00
                            </p>
                        </div>
                        
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-dark my-3 mx-2 text-bg-dark">
                        <div className="card-body">
                            <h5 className="card-title">Details</h5>
                            <p className="card-text">Price: {details.name}</p>
                            <p className="card-text">Price: ${details.price}</p>
                            <p className="card-text">Discount: {details.discount}%</p>
                            <p className="card-text">Description: {details.description}</p>
                            {/* todos los parametros que quiera los pongo aqui */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
