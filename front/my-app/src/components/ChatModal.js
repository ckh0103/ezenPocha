import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import '../styles/Chat.css'; // ChatModal 전용 CSS를 import

const ChatModal = ({ isOpen, onClose, targetTable, onSendMessage, myTableId }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { lastMessage } = useWebSocket();
    const chatBodyRef = useRef(null);

    // 모달이 열릴 때마다 이전 채팅 내역을 초기화합니다.
    useEffect(() => {
        if (isOpen) {
            setMessages([
                { sender: 'system', text: `${targetTable.name}님과의 대화입니다. 즐거운 시간 보내세요!` }
            ]);
        }
    }, [isOpen, targetTable]);

    // 서버로부터 새로운 채팅 메시지를 받았을 때 처리합니다.
    useEffect(() => {
        
        // ★★★ 1. 이 로그가 찍히는지 확인 (가장 중요) ★★★
        if (isOpen && lastMessage) {
            console.log("ChatModal: lastMessage 수신!", lastMessage);
        }

        if (isOpen && lastMessage && lastMessage.type === 'chat_message') {
            // 이 채팅방의 메시지가 맞는지 확인 (A-B 채팅 중 C가 보낸 메시지는 무시)
            const { from, text } = lastMessage.payload;

            // ★★★ 2. 이 조건문이 통과하는지 확인 ★★★
            console.log(`메시지 발신자: ${from}, 채팅 대상 ID: ${targetTable.id}`);

            if (from === targetTable.id) {
                // ★★★ 3. 이 로그가 찍히는지 확인 ★★★
                console.log("메시지를 상태에 추가합니다:", text);

                const newMessage = { sender: 'other', text };
                setMessages(prev => [...prev, newMessage]);
            }
        }
    }, [lastMessage, isOpen, targetTable]);

    // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 내립니다.
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim() === '') return;

        // 1. 부모 컴포넌트(CustomerPage)의 전송 함수를 호출합니다.
        onSendMessage(inputValue);

        // 2. 내가 보낸 메시지를 즉시 로컬 상태에 추가하여 화면에 보여줍니다.
        const myMessage = { sender: 'me', text: inputValue };
        setMessages(prev => [...prev, myMessage]);

        // 3. 입력창을 비웁니다.
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Enter로 인한 줄바꿈 방지
            handleSend();
        }
    };

    // 모달이 닫혀있으면 아무것도 렌더링하지 않습니다.
    if (!isOpen) {
        return null;
    }

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <div className="chat-modal-header">
                    <h3>{targetTable.name}님과의 대화</h3>
                    <button onClick={onClose} className="chat-close-btn">×</button>
                </div>
                <div className="chat-modal-body" ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            <div className="chat-bubble">{msg.text}</div>
                        </div>
                    ))}
                </div>
                <div className="chat-modal-footer">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="chat-input"
                    />
                    <button onClick={handleSend} className="chat-send-btn">전송</button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;