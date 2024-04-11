import React, { useState } from "react";

export const Newsletter = () => {
    const [email, setEmail] = useState('');
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const url = process.env.BACKEND_URL + "/api/subscribe"
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });
            const data = await response.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.error("Hubo un error al suscribir el email:", error);
            alert("Error al suscribirse. Por favor, intenta de nuevo más tarde.");
        }
    };

    return (
        <section className="subscription bg-white">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="subscription-wrapper">
                            <div className="d-flex subscription-content justify-content-between align-items-center flex-column flex-md-row text-center text-md-left">
                                <h3 className="flex-fill">Enterate de<br />todas las novedades</h3>
                                <form className="row flex-fill" onSubmit={handleSubmit}>
                                    <div className="col-lg-7 my-md-2 my-2">
                                        <input
                                            type="email"
                                            className="form-control px-4 border-0 w-100 text-center text-md-left"
                                            id="email"
                                            placeholder="Your Email"
                                            name="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </div>
                                    <div className="col-lg-5 my-md-2 my-2">
                                        <button type="submit" className="btn btn-primary btn-lg border-0 w-100">Subscribe Now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};