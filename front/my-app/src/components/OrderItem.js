import React from 'react';

const OrderItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="order-list-item">
      <span className="order-item-name">{item.name}</span>
      <div className="quantity-controls">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <span className="order-item-price">{(item.price * item.quantity).toLocaleString()}</span>
      <button className="remove-item" onClick={() => onRemoveItem(item.id)}>x</button>
    </div>
  );
};

export default OrderItem;