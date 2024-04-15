import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Success = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        // Llamar al backend para limpiar el carrito del usuario
        const clearUserCart = async () => {
            const token = localStorage.getItem('token'); // Asegúrate de manejar la autenticación según como la hayas implementado
            try {
                const response = await fetch(process.env.BACKEND_URL+'/api/clear-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Asegúrate de incluir el token de autenticación si es necesario
                    },
                });

                if (!response.ok) throw new Error('Failed to clear cart');

                // Limpia el carrito en el estado del frontend
                actions.clearCart();

                // Redirige al inicio o a otra página de éxito después de 5 segundos
                setTimeout(() => {
                    navigate('/');
                }, 5000);

            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        };

        clearUserCart();
    }, [actions, navigate]);

    return (
        <div className='container text-center mt-5'>
            <h1 className=''>Pago completado</h1>
            <p>Tu pago ha sido procesado exitosamente y lo recibirás en tu correo electrónico.</p>
            <p>Serás redirigido en breve...</p>
        </div>
    );
};