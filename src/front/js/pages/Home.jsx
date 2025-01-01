import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";
import { ProductsList } from "./ProductsList.jsx";
import { Slider } from "./Slider.jsx";
import { Newsletter } from "../component/Newsletter.jsx";
import { Logos } from "./Logos.jsx";
import GameContainer from "../component/GameContainer.jsx";



export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="text-center mt-2">
      <GameContainer />
      <Slider />
      <Logos />
      <ProductsList />
      <Newsletter />
    </div>
  );
};
