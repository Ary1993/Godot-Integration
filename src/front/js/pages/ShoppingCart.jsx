import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

export const ShoppingCart = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCartData = async () => {
            const token = localStorage.getItem('token');
            if (!store.user || !store.user.cartId) {
                console.error("User data is not available or Cart ID is missing");
                return;
            }
            const cartId = store.user.cartId;
            const url = `https://friendly-space-enigma-r9v4r559xvqhprg6-3001.app.github.dev/api/carts/${cartId}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                actions.setCart(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading cart data:", error);
                setIsLoading(false);
            }
        };

        loadCartData();
    }, [store.user, actions]);

    function handleDelete(cartId, itemId) {
        const token = localStorage.getItem('token');
        fetch(`https://friendly-space-enigma-r9v4r559xvqhprg6-3001.app.github.dev/api/carts/${cartId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Item deleted:', data);
                actions.removeItemFromCart(itemId); // Esto debería eliminar el ítem del estado global
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    actions.removeItemFromCart = (itemId) => {
        // Asegúrate de que 'store.carts' y 'store.carts.items' existen antes de filtrar
        if (store.carts && store.carts.items) {
            const updatedItems = store.carts.items.filter(item => item.id !== itemId);
            actions.setCart({ ...store.carts, items: updatedItems });
        }
    }

    function handleCheckout() {
        if (store.user && store.carts && store.carts.items && store.carts.items.length > 0) {
            const userEmail = store.user.email;
            const products = store.carts.items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }));

            const requestBody = {
                email: userEmail,
                products: products
            };

            setIsLoading(true);
            fetch('https://friendly-space-enigma-r9v4r559xvqhprg6-3001.app.github.dev/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => {
                    setIsLoading(false);
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.checkout_url) {
                        // No borramos el carrito aquí, solo redirigimos al usuario
                        window.location.href = data.checkout_url; // Redirige después de una pausa
                    } else {
                        throw new Error('Checkout URL not provided');
                    }
                })
                .catch(error => {
                    console.error('Error during checkout:', error);
                });
        } else {
            console.log("No hay ítems en el carrito o falta información del usuario. Agrega productos o verifica tus datos antes de proceder al checkout.");
        }
    }

    const calculateTotal = () => {
        if (store.carts && store.carts.items) {
            return store.carts.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
        return 0; // Retorna 0 si store.carts o store.carts.items no están disponibles
    };

    return (
        <section className="vh-100" style={{ backgroundColor: "#92AC86" }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col">
                        <h2>Carrito</h2>
                        <h4>({store.carts && store.carts.items ? store.carts.items.length : 0} objetos)</h4>
                        <div className="card mb-4">
                            {isLoading ? (
                                <p>Cargando detalles del carrito...</p>
                            ) : store.carts && store.carts.items && store.carts.items.length > 0 ? (
                                store.carts.items.map((item, index) => (
                                    <div className="card-body p-4 mb-2" key={index}>
                                        <div className="row align-items-center">
                                            <div className="col-md-2">
                                                <img src={item.image_url} className="img-fluid" alt="Product" />
                                            </div>
                                            <div className="col-md-2">
                                                <p className="small text-muted">Nombre producto</p>
                                                <p className="lead fw-normal">{item.product_name}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p className="small text-muted">Cantidad</p>
                                                <p className="lead fw-normal">{item.quantity}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p className="small text-muted">Precio</p>
                                                <p className="lead fw-normal">{item.price}</p>
                                            </div>
                                            <div className="col-md-2">
                                                <p className="small text-muted">Total</p>
                                                <p className="lead fw-normal">{item.price * item.quantity}</p>
                                            </div>
                                            <div className="col-md-1 text-center">
                                                <i onClick={() => handleDelete(store.user.cartId, item.id)} className="fas fa-trash-alt text-danger" style={{ cursor: 'pointer' }}></i>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron ítems en el carrito.</p>
                            )}
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between">
                                    <p className="lead fw-normal font-size 20 mt-3">Total del pedido: {calculateTotal()}€</p>
                                    <button type="button" className="btn btn-primary btn-md " onClick={handleCheckout}>
                                        Pagar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};