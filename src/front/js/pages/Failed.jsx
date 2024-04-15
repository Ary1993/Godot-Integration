import React from 'react';

export const Failed = () => {
    return (
        <div className='container justify-content-center text-danger text-center align-items-center mt-5'>
            <h1 className='text-danger'>Pago fallido</h1>
            <p>Ocurrió un problema con tu pago. Por favor, intentalo de nuevo en el carrito.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = 'https://studious-funicular-vq6gw76v7gg3x9r6-3000.app.github.dev/cart'}>Ir al carrito </button>
        </div >
    );
};