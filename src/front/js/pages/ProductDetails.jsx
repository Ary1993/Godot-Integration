import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import Button from 'react-bootstrap/Button';
import AlertComponent from "../component/Alert.jsx";


export const ProductDetails = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();

    const details = store.products.find(item => item.id == params.idProduct);
    
    const handleOnClick = async () => {
        const dataToSend = {
            email: email,
            password: password
        }
        await actions.handleLogin(dataToSend.email, dataToSend.password);
    }


    //const details = store.products.find(item => item.id === parseInt(params.idProduct));
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    if (!details) {
        return <div className="container">Loading...</div>;
    }

    function handleAddToCart(product) {
        const token = localStorage.getItem('token');
        fetch(process.env.BACKEND_URL + "/api/cart-items", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1  // Asumiendo una cantidad fija para simplificar; ajustar según sea necesario
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Item added:', data);
                setAlertMessage('Item añadido al carrito');
                setShowAlert(true);
            })
            .catch(error => {
                console.error('Error:', error);
                setAlertMessage('Error al añadir el item al carrito');
                setShowAlert(true);
            });
    }

    return (
        <div className="container " style={{
            backgroundImage: 'url("")',
        }}>
            <AlertComponent show={showAlert} message={alertMessage} onClose={() => setShowAlert(false)} />
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
                            <Button variant="primary" onClick={() => handleAddToCart(details)}>Add to Cart</Button>{' '}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-dark my-3 mx-2 text-bg">
                        <div className="card-body">
                            <h5 className="card-title">Details</h5>
                            <p className="card-text">Name: {details.name}</p>
                            <p className="card-text">Price: ${details.price}</p>
                            <p className="card-text">Description: {details.description}</p>

                            {/* todos los parametros que quiera los pongo aqui */}
                            <button onClick={() => actions.toggleFavorite(details)} className="btn btn-outline-warning my-auto">
                                <i className={`${actions.getHeartClass(details)} my-auto`}></i>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

