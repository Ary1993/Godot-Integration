import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

export const ShoppingCart = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const id = 1;
            const url = `https://orange-doodle-v476gjj4wj6fjwx-3001.app.github.dev/api/cart/` + id;
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
                actions.cart(data); // Actualiza el store global con los datos obtenidos
                setIsLoading(false);
            } catch (error) {
                console.error("Error al obtener los datos del carrito:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [actions]); // Añade las dependencias necesarias aquí

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
                                <li key={index}>{item.name}: {item.quantity}</li> // Asegúrate de ajustar según la estructura real de tus ítems
                            ))}
                        </ul>
                    ) : (
                        <p>No se encontraron ítems en el carrito.</p>
                    )}
                </div>
            </div>
        </div>
    );
};