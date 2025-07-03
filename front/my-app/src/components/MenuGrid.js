import React from "react";

const MenuGrid = ({ items, onAddToCart }) => {
  return (
    <div className="menu-grid">
      {items.map((item) => (
        // key를 item.menuId 또는 item.id로 설정하여 React 경고 제거
        <div key={item.menuId || item.id} className="menu-item" onClick={() => onAddToCart(item)}>
          <img src={item.image} alt={item.name} />
          <div className="item-name">{item.name}</div>
          <div className="item-price">{item.price.toLocaleString()}원</div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;