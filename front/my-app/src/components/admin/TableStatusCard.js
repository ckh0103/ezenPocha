import React from 'react';

const TableStatusCard = ({ tableData, onClearOrder }) => {
    // tableData에서 필요한 모든 정보를 구조분해 할당합니다.
    const { id, tableNumber, status, genderCount, items, totalAmount } = tableData;

    const handleClearClick = () => {
        if (window.confirm(`${tableNumber} 테이블의 주문을 초기화하시겠습니까?`)) {
            // onClearOrder 함수에 tableData의 고유 id를 전달합니다.
            onClearOrder(id);
        }
    };

    const getStatusIndicator = () => {
        if (status === 'EMPTY') return <span className="status-empty">비었음</span>;
        if (status === 'OCCUPIED' && genderCount) {
            return (
                <span className="status-occupied">
                    남:{genderCount.male} / 여:{genderCount.female}
                </span>
            );
        }
        return <span className="status-unknown">{status}</span>;
    };

    return (
        <div className={`table-status-card ${status === 'EMPTY' ? 'empty' : ''}`}>
            <div className="card-header">
                <h3>{tableNumber}</h3>
                <div className="status-info">
                    {getStatusIndicator()}
                </div>
                {status !== 'EMPTY' && (
                     <button onClick={handleClearClick} className="clear-table-btn">결제</button>
                )}
            </div>
            <div className="card-body">
                {items && items.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Menu</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.no || index}>
                                    <td>{item.no || index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>총액:</td>
                                <td style={{ fontWeight: 'bold' }}>{totalAmount.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <p className="empty-message">Empty</p>
                )}
            </div>
        </div>
    );
};

export default TableStatusCard;