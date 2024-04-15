import React from "react";

export const Logos = () => {
    
    const icons = [
        { name: "fa-solid fa-desktop", style: { marginLeft: "20px", marginRight: "20px" } },
        { name: "fa-brands fa-xbox", style: { marginRight: "20px" } },
        { name: "fa-brands fa-playstation" }
    ];

    const repeatedIcons = [];
    for (let i = 0; i < 15; i++) {
        repeatedIcons.push(...icons);
    }

    return (
        <nav className="navbar navbar-expand-lg  mt-4" >
            <div className="container-fluid d-flex justify-content-center">
                <div className="div">
                    {repeatedIcons.map((icon, index) => (
                        <i key={index} className={icon.name} style={icon.style}></i>
                    ))}
                </div>
            </div>
        </nav>
    );
};
