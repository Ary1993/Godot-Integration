import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
export const Profile = () => {
    const [user, setUser] = useState(null);
    const { store, actions } = useContext(Context);
    useEffect(() => {
        const id = store.user.id
        const url = process.env.BACKEND_URL + '/api/users/' + id;
        const token = localStorage.getItem('token');
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue ok');
                }
                return response.json();
            })
            .then(data => {
                setUser(data.results);
            })
            .catch(error => {
                console.error("Error al obtener los datos del usuario:", error);
            });
    }, []);
    if (!user) return <div>Acceso denegado, no estas logeado en nuestra pagina web</div>;

    return (
        <div>
            <div className="card d-flex align-center" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">{user.nick_name}</h5>
                    <p className="card-text">Email: {user.email}</p>
                    <p className="card-text">ID: {user.id}</p>
                </div>
            </div>
        </div>
    );
}