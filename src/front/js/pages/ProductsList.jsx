import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Context } from '../store/appContext';



export const ProductsList = () => {
    const { store, actions } = useContext(Context);
    // Function to toggle the favorite status of a product
    const toggleFavorite = (product) => {
        console.log(store.isLogin);
        if (store.isLogin) {

        }
        else {
            const isFavorite = store.wishes.filter(wish => wish.product_id === product.id);
            console.log(isFavorite);
            if (isFavorite.length === 0) {
                console.log("Igual a cero");
                actions.addWishes(product);
            } else {
                console.log("Distinto que cero");
                actions.removeWishes(isFavorite[0].id, product.id); // Assuming removeWishes accepts the product and the new array of wishes
            }
        }
    }


    // Function to return the appropriate class for the heart icon
    const getHeartClass = (product) => {
        return store.wishes.some(wish => wish.id == product.id) ? "fas fa-heart text-warning" : "far fa-heart";
    }

    return (
        <div className="container">
            <h1 className="mb-4">Products List</h1>
            <div className="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-2">
                {!store.products ? <h2>Loading...</h2> :
                    store.products.map((product) => (
                        <div key={product.id} className="col">
                            <div className="card border-dark my-3 mx-2 text-bg-dark">
                                <img src={product.image_url} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className='card-text'>
                                        ID: {product.id}
                                        <br />
                                        ${product.price}.00
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Link className="btn btn-secondary" to={"/product/" + product.id}>Details</Link>
                                    <span onClick={() => toggleFavorite(product)} className="btn btn-outline-warning">
                                        <i className={getHeartClass(product)}></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}