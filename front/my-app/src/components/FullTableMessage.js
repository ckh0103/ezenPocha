import React from 'react';

const fullMessageStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#222',
    color: 'white',
    fontSize: '2rem',
    textAlign: 'center'
};

const FullTableMessage = () => {
    return (
        <div style={fullMessageStyles}>
            <p>죄송합니다. 현재 모든 테이블이 차 있습니다.<br/>잠시 후 다시 시도해주세요.</p>
        </div>
    );
};

export default FullTableMessage;