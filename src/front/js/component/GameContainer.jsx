import React from "react";
import GodotGame from "./GodotGame.jsx";


const GameContainer = ({ width = "100%", height = "500px", zIndex = 10 }) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        zIndex,
        overflow: "hidden",
        margin: "0 auto", // Center the game if needed
      }}
    >
      <GodotGame />
    </div>
  );
};

export default GameContainer;
