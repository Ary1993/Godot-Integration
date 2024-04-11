import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

export const ShoppingCart = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const id = 1;
            const url = `https://friendly-space-enigma-r9v4r559xvqhprg6-3001.app.github.dev/api/carts/` + id;
            const token = localStorage.getItem('token');
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
                // Suponiendo que data ya contiene los items del carrito bajo data.items
                actions.carts(data); // Actualiza el store global con los datos obtenidos
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del carrito:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [actions]);

    const handleCheckout = async () => {
        const email = "user@example.com"; // Este email debería ser dinámico o estar almacenado en el store/context
        const products = store.carts.map(item => ({ product_id: item.product_id, quantity: item.quantity }));

        try {
            const response = await fetch('https://friendly-space-enigma-r9v4r559xvqhprg6-3001.app.github.dev/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, products }), // Nota el cambio aquí a 'products'
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecciona al usuario a la URL de checkout de Stripe
                window.location.href = data.checkout_url;
            } else {
                // Maneja errores
                console.error('Error en el checkout:', data.error);
            }
        } catch (error) {
            console.error('Error al conectar con el backend:', error);
        }
    };

    return (
        <div>
            <div className="card d-flex align-items-center" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">Detalles del Carrito</h5>
                    {isLoading ? (
                        <p>Cargando detalles del carrito...</p>
                    ) : store.carts ? (
                        <ul>
                            {store.carts.map((item, index) => (
                                <li key={index}>Producto {item.product_name} <br /> Cantidad {item.quantity}</li> // Asegúrate de ajustar según la estructura real de tus ítems
                            ))}
                        </ul>
                    ) : (
                        <p>No se encontraron ítems en el carrito.</p>
                    )}
                </div>
                {!isLoading && store.carts.length > 0 && (
                    <button onClick={handleCheckout} className="btn btn-success ms-2">
                        Pagar
                    </button>
                )}
            </div>
        </div>
    );
};