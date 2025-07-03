import React from 'react';

const TopBar = ({ tableInfo, onSelectView, currentView }) => {
    return (
        <div className="top-bar">
            <div className="logo">EZEN 포차</div>
            <nav>
                <span 
                    onClick={() => onSelectView('menu')}
                    className={currentView === 'menu' ? 'active-view' : ''}
                >
                    메뉴
                </span>
                <span 
                    onClick={() => onSelectView('game')}
                    className={currentView === 'game' ? 'active-view' : ''}
                >
                    게임
                </span>
                <span 
                    onClick={() => onSelectView('chat')} 
                    style={{cursor:'pointer'}}
                >
                    채팅
                </span>
                <span 
                    onClick={() => onSelectView('call')} 
                    style={{cursor:'pointer'}}
                >
                    직원호출
                </span>
            </nav>
            <div className="table-number">
                {tableInfo ? tableInfo.name : '로딩 중...'}
            </div>
        </div>
    );
};

export default TopBar;