import React from 'react';
import OrderItem from './OrderItem';

const OrderSummary = ({ orderItems, onUpdateQuantity, onRemoveItem, onPlaceOrder, onClearOrder }) => {
  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="order-summary">
      <h3>주문서</h3>
      <div className="order-list-header">
        <span>메뉴</span>
        <span>수량</span>
        <span>가격</span>
        <span></span> {/* For remove button column */}
      </div>
      <div className="order-list">
        {orderItems.length === 0 ? (
          <p className="empty-order">장바구니가 비었습니다.</p>
        ) : (
          orderItems.map((item) => (
            <OrderItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>
      <div className="order-total">
        <span>총 주문금액</span>
        <span>{totalAmount.toLocaleString()}</span>
      </div>
      <button className="order-button" onClick={onPlaceOrder} disabled={orderItems.length === 0}>
        주문하기
      </button>
      <button className="clear-button" onClick={onClearOrder} disabled={orderItems.length === 0}>
        전체삭제
      </button>
    </div>
  );
};

export default OrderSummary;