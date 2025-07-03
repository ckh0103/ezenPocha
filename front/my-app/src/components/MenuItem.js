import React from "react";

const MenuItem = ({item, onAddToCart}) => {
    return (
        <div className="menu-item" onClick={() =>
            onAddToCart(item)
        }>
            <img src = {item.image} alt = {item.name} />
            <div className="item-name">{item.name}</div>
            <div className="item-price">
                {item.price.toLocaleString()}
            </div>
        </div>
    );
};

export default MenuItem;