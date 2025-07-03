import React from "react";
import GenderItem from "./GenderItem";

const GenderGrid = ({items, onAddToCart}) => {
    // if (!items || items.length === 0){
    //     return<div className="menu-grid"><p>선택된 카테고리에 메뉴가 없습니다.</p></div>;
    // }

    return(
        <div className="menu-grid">
            {items.map((item) => (
                <GenderItem key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
        </div>
    );
};

export default GenderGrid;