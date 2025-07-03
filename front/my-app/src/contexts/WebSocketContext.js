// src/contexts/WebSocketContext.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

// props로 id를 받도록 수정 (예: "table-4", "admin")
export const WebSocketProvider = ({ id, children }) => { 
    const [lastMessage, setLastMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        // id가 없으면 연결 시도를 하지 않음
        if (!id) return;

        // ▼▼▼ 이 부분을 수정해야 합니다! ▼▼▼
        // 변경 전 (에러 발생의 원인)
        // const SERVER_URL = `ws://localhost:8080/`; 

        // 변경 후 (올바른 엔드포인트 경로 추가)
        // Spring Boot 서버와 약속된 전체 경로로 접속해야 합니다.
        // id를 쿼리 파라미터로 넘겨서 서버가 클라이언트를 식별하도록 합니다.
        const SERVER_URL = `ws://localhost:8080/ws/pocha?id=${id}`;
        
        try {
            ws.current = new WebSocket(SERVER_URL);
        } catch (error) {
            console.error("WebSocket 생성 오류:", error);
            return;
        }

        ws.current.onopen = () => {
            console.log(`WebSocket 연결 성공 (ID: ${id})`);
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('WebSocket 메시지 수신:', message);
                setLastMessage(message);
            } catch (e) {
                console.error('수신된 메시지 파싱 오류:', event.data, e);
            }
        };

        ws.current.onclose = (event) => {
            // event.code와 event.reason을 통해 왜 닫혔는지 더 자세히 알 수 있습니다.
            console.log(`WebSocket 연결 종료 (ID: ${id}, Code: ${event.code}, Reason: ${event.reason})`);
            setIsConnected(false);
        };

        ws.current.onerror = (error) => {
            console.error(`WebSocket 오류 (ID: ${id}):`, error);
        };

        // 컴포넌트가 언마운트될 때 WebSocket 연결을 정리합니다.
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [id]); // id가 바뀔 때마다 재연결을 시도하도록 의존성 배열에 추가

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket이 연결되지 않았습니다. 메시지를 보낼 수 없습니다.');
        }
    };

    const value = {
        lastMessage,
        isConnected,
        sendMessage,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};