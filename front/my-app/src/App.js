import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useParams } from 'react-router-dom';
import './styles/Ezen.css';
import './styles/Game.css';
import './styles/Chat.css';
import './styles/admin/Admin.css';

import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import MenuGrid from './components/MenuGrid';
import OrderSummary from './components/OrderSummary';
import ChatModal from './components/ChatModal';
import ChatLayout from './components/ChatLayout';
import GameLayout from './components/GameLayout';
import WelcomeModal from './components/WelcomeModal';
import AdminLayout from './components/admin/AdminLayout';
import { WebSocketProvider, useWebSocket } from './contexts/WebSocketContext';

const initialGenderGameData = [
    { id: 'game1', title: '진실게임', image: 'https://placehold.co/150x120/ff6b6b/fff?text=진실게임' },
    { id: 'game2', title: '참참참', image: 'https://placehold.co/150x120/5c7cfa/fff?text=참참참' },
    { id: 'game3', title: '이미지게임', image: 'https://placehold.co/150x120/cc5de8/fff?text=이미지게임' }
];

const CustomerAppLayout = ({
  tableInfo,
  menuItems,
  orderItems,
  selectedCategory,
  onSelectCategory,
  handleAddToCart,
  handleUpdateQuantity,
  handleRemoveItem,
  handlePlaceOrder,
  handleClearOrder,
  currentMainView,
  handleViewChange,
  genderGameItems,
  tableOrders,
  currentTableInfo,
  onOpenChatRequest,
  onOpenGameRequest
}) => {
  const filteredMenuItems = menuItems.filter(item => item.category === selectedCategory);
  return (
    <div className="App">
      <TopBar
        tableInfo={tableInfo}
        onSelectView={handleViewChange}
        currentView={currentMainView}
      />
      <div className="main-content">
        <Sidebar
          categories={[...new Set(menuItems.map(item => item.category))].map(cat => ({id: cat, name: cat}))}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
        <div className="content-area">
          {currentMainView === 'menu' && <MenuGrid items={filteredMenuItems} onAddToCart={handleAddToCart} />}
          {currentMainView === 'game' && <GameLayout tables={tableOrders} games={genderGameItems} onOpenGameRequest={onOpenGameRequest} currentTableInfo={currentTableInfo} />}
          {currentMainView === 'chat-select' && <ChatLayout tables={tableOrders} onOpenChatRequest={onOpenChatRequest} currentTableInfo={currentTableInfo} />}
        </div>
        <OrderSummary
          orderItems={orderItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onPlaceOrder={handlePlaceOrder}
          onClearOrder={handleClearOrder}
        />
      </div>
    </div>
  );
};

const CustomerPage = ({ menuItems, categoriesData }) => {
  const { tableId } = useParams();
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isInitialized, setIsInitialized] = useState(false);

  const [orderItems, setOrderItems] = useState([]);
  const [currentMainView, setCurrentMainView] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState(categoriesData.length > 0 ? categoriesData[0].id : '탕&찌개');

  const [tableOrders, setTableOrders] = useState([]);
  const [chatTarget, setChatTarget] = useState(null);
  const [gameTarget, setGameTarget] = useState(null);

  const { lastMessage, sendMessage } = useWebSocket();

  useEffect(() => {
    if (!lastMessage) return;

    console.log("새로운 메시지 감지:", lastMessage);

        switch (lastMessage.type) {
            case 'all_tables_status':
                setTableOrders(lastMessage.payload);
                break;

            case 'chat_request': {
                const { from: fromId, fromName } = lastMessage.payload;
                if (window.confirm(`${fromName} 테이블에서 채팅 요청이 왔습니다. 수락하시겠습니까?`)) {
                    sendMessage({ type: 'chat_accept', payload: { from: `table-${tableId}`, to: fromId, fromName: tableInfo.name } });
                    setChatTarget({ id: fromId, name: fromName });
                }
                break;
            }

            case 'chat_accept': {
                const { from: acceptedById, fromName: acceptedByName } = lastMessage.payload;
                alert(`${acceptedByName} 테이블이 채팅 요청을 수락했습니다!`);
                setChatTarget({ id: acceptedById, name: acceptedByName });
                break;
            }

            case 'game_request': {
                const { from: fromId, fromName, gameTitle, gameId } = lastMessage.payload;
                if (window.confirm(`${fromName} 테이블에서 [${gameTitle}] 게임을 신청했습니다. 수락하시겠습니까?`)) {
                  sendMessage({
                    type: 'game_accept',
                    payload: { from: `table-${tableId}`, to: fromId, fromName: tableInfo.name, gameTitle, gameId }
                  });
                  setGameTarget({ id: fromId, name: fromName, gameTitle, gameId });
                  alert(`[${gameTitle}] 게임을 시작합니다!`);
                } else {
                  sendMessage({
                    type: 'game_decline',
                    payload: { from: `table-${tableId}`, to: fromId, fromName: tableInfo.name, gameTitle, gameId }
                  });
                  alert(`${fromName} 테이블의 [${gameTitle}] 게임 신청을 거절했습니다.`);
                }
                break;
            }

            case 'game_accept': {
                const { from: acceptedById, fromName: acceptedByName, gameTitle, gameId } = lastMessage.payload;
                alert(`${acceptedByName} 테이블이 [${gameTitle}] 게임 요청을 수락했습니다! 게임을 시작합니다.`);
                setGameTarget({ id: acceptedById, name: acceptedByName, gameTitle, gameId });
                break;
            }

            case 'game_decline': {
                const { from: declinedById, fromName: declinedByName, gameTitle } = lastMessage.payload;
                alert(`${declinedByName} 테이블이 [${gameTitle}] 게임 요청을 거절했습니다.`);
                setGameTarget(null);
                break;
            }

            case 'error': { // 백엔드에서 보낸 에러 메시지 처리
                const { message, originalType, targetId } = lastMessage.payload;
                console.error(`WebSocket Error: ${message} (Original Type: ${originalType}, Target ID: ${targetId})`);
                alert(`오류 발생: ${message}`);
                // 요청했던 기능에 따라 gameTarget/chatTarget을 초기화할 수 있습니다.
                if (originalType && originalType.startsWith('chat_')) {
                    setChatTarget(null);
                } else if (originalType && originalType.startsWith('game_')) {
                    setGameTarget(null);
                }
                break;
            }
        }
  }, [lastMessage, tableId, tableInfo, sendMessage]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/tables/${tableId}`)
      .then(res => {
        if (!res.ok) throw new Error('테이블 정보를 찾을 수 없습니다.');
        return res.json();
      })
      .then(data => setTableInfo(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [tableId]);

  const handleWelcomeConfirm = (genderData) => {
    setIsInitialized(true);
    sendMessage({
      type: 'enter_table',
      payload: { tableId: parseInt(tableId), male: genderData.male, female: genderData.female } // tableId를 Long으로 변환
    });
  };

  const handleSelectCategory = (categoryId) => setSelectedCategory(categoryId);
  const handleAddToCart = (itemToAdd) => {
    setOrderItems((prev) => {
      const existing = prev.find(item => item.menuId === itemToAdd.menuId);
      if (existing) {
        return prev.map(item => item.menuId === itemToAdd.menuId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...itemToAdd, quantity: 1 }];
    });
  };
  const handleUpdateQuantity = (itemId, newQuantity) => {
    setOrderItems((prev) =>
      newQuantity > 0
        ? prev.map(item => item.menuId === itemId ? { ...item, quantity: newQuantity } : item)
        : prev.filter(item => item.menuId !== itemId)
    );
  };
  const handleRemoveItem = (itemId) => setOrderItems((prev) => prev.filter(item => item.menuId !== itemId));

  const handlePlaceOrder = () => {
    if (orderItems.length === 0) return alert('주문할 메뉴를 선택해주세요.');
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    sendMessage({
      type: 'place_order',
      payload: { tableId: parseInt(tableId), items: orderItems.map(i => ({name: i.name, quantity: i.quantity, price: i.price*i.quantity})), totalAmount } // tableId를 Long으로 변환
    });
    alert('주문이 완료되었습니다!');
    setOrderItems([]);
  };
  const handleClearOrder = () => setOrderItems([]);
  const handleCloseChat = () => setChatTarget(null);

  const handleChatRequest = (targetTable) => {
      if (!tableInfo) return alert('내 테이블 정보 로딩 중입니다.');

      if (window.confirm(`${targetTable.name} 테이블에 채팅을 요청하시겠습니까?`)) {
          sendMessage({
              type: 'chat_request',
              payload: {
                  from: `table-${tableId}`,
                  to: `table-${targetTable.id}`,
                  fromName: tableInfo.name, // tableInfo.name은 'NO.03'과 같은 문자열 (EzenTable의 name 필드)
              }
          });
          alert(`${targetTable.name} 테이블에 채팅 요청을 보냈습니다.`);
      }
  };

  const handleGameRequest = (gameId, gameTitle, targetTable) => {
    if(!tableInfo) return alert('내 테이블 정보 로딩 중입니다.');
    if (`table-${tableId}` === `table-${targetTable.id}`) {
      alert('자신에게는 게임을 신청할 수 없습니다.');
      return;
    }

    if(window.confirm(`${targetTable.name} 테이블에 [${gameTitle}] 게임을 요청하시겠습니까?`)){
      sendMessage({
        type : 'game_request',
        payload: {
            from: `table-${tableId}`,
            to: `table-${targetTable.id}`,
            fromName: tableInfo.name,
            gameId: gameId,
            gameTitle: gameTitle
        }
      });
      alert(`${targetTable.name} 테이블에 [${gameTitle}] 게임 요청을 보냈습니다.`);
      setGameTarget({ id: `table-${targetTable.id}`, name: targetTable.name, gameTitle, gameId });
    }
  };

  const handleSendChatMessage = (text) => {
    if (chatTarget) {
      sendMessage({
        type: 'chat_message',
        payload: {
          from: `table-${tableId}`,
          to: chatTarget.id,
          text: text,
          senderName: tableInfo.name,
        }
      });
    }
  };

  const handleViewChange = (view) => {
    if (view === 'chat') {
        setCurrentMainView('chat-select');
    }
    else if (view === 'call') {
      if (tableInfo) {
        const callId = `call-${tableInfo.id}-${Date.now()}`;

        sendMessage({
          type: 'staff_call',
          payload: {
              id: callId,
              tableId: tableInfo.id,
              tableName: tableInfo.name,
              time: new Date().toLocaleTimeString()
          }
        });
        alert('직원을 호출했습니다. 잠시만 기다려주세요.');
      }
    }
    else {
      setCurrentMainView(view);
    }
  };

  if (loading) return <div>테이블 정보 로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <>
      <WelcomeModal isOpen={!isInitialized} onConfirm={handleWelcomeConfirm} />
      <ChatModal
        isOpen={!!chatTarget}
        onClose={handleCloseChat}
        targetTable={chatTarget}
        onSendMessage={handleSendChatMessage}
        myTableId={`table-${tableId}`}
      />
      {isInitialized && (
        <CustomerAppLayout
          tableInfo={tableInfo}
          menuItems={menuItems}
          orderItems={orderItems}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          handleAddToCart={handleAddToCart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleRemoveItem={handleRemoveItem}
          handlePlaceOrder={handlePlaceOrder}
          handleClearOrder={handleClearOrder}
          currentMainView={currentMainView}
          handleViewChange={handleViewChange}
          genderGameItems={initialGenderGameData}
          tableOrders={tableOrders}
          onOpenChatRequest={handleChatRequest}
          onOpenGameRequest={handleGameRequest}
          currentTableInfo={tableInfo}
        />
      )}
    </>
  );
};

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const API_BASE_URL = 'http://localhost:8080/api';

  const fetchMenus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenuItems(data);

      const uniqueCategories = [...new Set(data.map(item => item.category))].map(cat => ({ id: cat, name: cat }));
      setCategoriesData(uniqueCategories);

    } catch (error) {
      console.error('메뉴 데이터를 불러오는데 실패했습니다:', error);
      alert('메뉴 데이터를 불러오는데 실패했습니다.');
    }
  }, []);

  const handleAddMenuItem = async (menuData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add menu: ${response.status} - ${errorText}`);
      }
      alert('메뉴가 성공적으로 등록되었습니다.');
      fetchMenus();
    } catch (error) {
      console.error('메뉴 등록에 실패했습니다:', error);
      alert(`메뉴 등록에 실패했습니다: ${error.message}`);
    }
  };

  const handleUpdateMenuItem = async (menuData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/${menuData.menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update menu: ${response.status} - ${errorText}`);
      }
      alert('메뉴가 성공적으로 수정되었습니다.');
      fetchMenus();
    } catch (error) {
      console.error('메뉴 수정에 실패했습니다:', error);
      alert(`메뉴 수정에 실패했습니다: ${error.message}`);
    }
  };

  const handleDeleteMenuItem = async (menuId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/${menuId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete menu: ${response.status} - ${errorText}`);
      }
      alert('메뉴가 성공적으로 삭제되었습니다.');
      fetchMenus();
    } catch (error) {
      console.error('메뉴 삭제에 실패했습니다:', error);
      alert(`메뉴 삭제에 실패했습니다: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return (
    <Router>
      <nav style={{ padding: '10px', background: '#111', textAlign: 'center' }}>
        <Link to="/table/4" style={{ color: 'white', marginRight: '15px' }}>테이블 페이지</Link>
        <Link to="/admin" style={{ color: 'white' }}>관리자 페이지</Link>
      </nav>
      <Routes>
        <Route path="/table/:tableId" element={
          <WebSocketProvider id={`table-${window.location.pathname.split('/').pop()}`}>
            <CustomerPage menuItems={menuItems} categoriesData={categoriesData} />
          </WebSocketProvider>
        } />
        <Route path="/admin/*" element={
          <WebSocketProvider id="admin">
            <AdminLayout
              menuItems={menuItems}
              categoriesData={categoriesData}
              onAddMenuItem={handleAddMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
            />
          </WebSocketProvider>
        } />
        <Route path="*" element={<Navigate to="/table/4" replace />} />
      </Routes>
    </Router>
  );
}

export default App;