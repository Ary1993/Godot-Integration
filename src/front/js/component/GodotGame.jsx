import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const GodotGame = () => {
    const { store, actions } = useContext(Context);
    const { gameStatus } = store;

    useEffect(() => {
        console.log("Initializing game on page load...");
        actions.initializeGame(); // Initialize the game as soon as the component mounts
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Canvas for the Godot game */}
            <canvas
                id="canvas"
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#000", // Placeholder background
                }}
            ></canvas>

            {/* Status Overlay */}
            {gameStatus.mode !== "hidden" && (
                <div
                    id="status"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "#242424",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                    }}
                >
                    {gameStatus.mode === "progress" && (
                        <div>
                            <p>Loading...</p>
                            <progress
                                id="status-progress"
                                value={gameStatus.progress.current}
                                max={gameStatus.progress.total}
                            ></progress>
                        </div>
                    )}
                    {gameStatus.mode === "error" && (
                        <div>
                            <p>Error: {gameStatus.error}</p>
                            <p>Please try reloading the page or check the console for more details.</p>
                            <button onClick={() => actions.initializeGame()}>Retry</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GodotGame;