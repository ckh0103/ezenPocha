import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import TableStatusCard from './TableStatusCard';

const AdminDashboard = () => {
    const { lastMessage, sendMessage } = useWebSocket();
    const [tableOrders, setTableOrders] = useState([]);
    const [calls, setCalls] = useState([]);

    useEffect(() => {
        if (!lastMessage) return;

        switch (lastMessage.type) {
            case 'all_tables_status':
                setTableOrders(lastMessage.payload);
                break;
            case 'staff_call':
                // staff_call 메시지를 받았을 때 calls 상태에 추가
                const newCall = lastMessage.payload;
                setCalls(prevCalls => {
                    // 중복 호출 방지를 위해 id를 기준으로 확인 (옵션)
                    const isDuplicate = prevCalls.some(call => call.id === newCall.id);
                    return isDuplicate ? prevCalls : [newCall, ...prevCalls];
                });
                break;
            case 'error': // WebSocket 처리 중 백엔드에서 발생한 에러 메시지
                console.error("Admin WebSocket Error:", lastMessage.payload);
                // 사용자에게 알림 (옵션)
                // alert(`관리자 페이지 오류: ${lastMessage.payload.message}`);
                break;
            // 다른 메시지 타입도 필요하다면 여기에 추가
        }
    }, [lastMessage]); // lastMessage가 변경될 때마다 실행

    const handleClearCall = (callIdToRemove) => {
        setCalls(prevCalls => prevCalls.filter(call => call.id !== callIdToRemove));
    };
    
    const handleClearTableOrder = (tableId) => {
        if (window.confirm("정말로 이 테이블의 주문을 초기화하시겠습니까?")) {
            sendMessage({
                type: 'clear_table',
                payload: { tableId: tableId }
            });
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-page-header">
                <h2>테이블 현황</h2>
            </header>

            {calls.length > 0 && (
                <div className="admin-calls-section">
                    <h3>📢 직원 호출 목록</h3>
                    <ul>
                        {calls.map((call) => (
                            <li key={call.id}>
                                <span>
                                    <strong>{call.tableName}</strong> 테이블에서 호출 ({call.time})
                                </span>
                                <button
                                    onClick={() => handleClearCall(call.id)}
                                    className="admin-delete-btn"
                                >
                                    완료
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="table-status-grid">
                {tableOrders.length > 0 ? (
                    tableOrders.map(table => (
                        <TableStatusCard
                            key={table.id}
                            tableData={table}
                            onClearOrder={handleClearTableOrder}
                        />
                    ))
                ) : (
                    <p>테이블 현황 데이터를 기다리는 중입니다...</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;