import React, { useState } from 'react';
import TableSelectionGrid from './TableSelectionGrid';
import GameSelectionGrid from './GameSelectionGrid';

const GameLayout = ({ tables, games, onOpenGameRequest, currentTableInfo }) => {
  const [viewMode, setViewMode] = useState('table-select');
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setViewMode('game-select');
  };

  const handleGoBack = () => {
    setSelectedTable(null);
    setViewMode('table-select');
  };

  if (viewMode === 'table-select') {
    // currentTableInfo.id를 currentTableId로 전달 (EzenTable의 id 필드 사용)
    return <TableSelectionGrid tables={tables} onTableSelect={handleTableSelect} currentTableId={currentTableInfo.id} />;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', marginBottom: '20px' }}>
        <button onClick={handleGoBack} className="clear-button" style={{ width: 'auto', marginRight: '20px' }}>
          ← 뒤로
        </button>
        {/* selectedTable.name 사용 (EzenTable의 name 필드) */}
        <h3 style={{ margin: 0 }}>{selectedTable.name} 테이블과 게임하기</h3>
      </div>
      <GameSelectionGrid
        games={games}
        selectedTable={selectedTable}
        onOpenGameRequest={onOpenGameRequest}
        currentTableInfo={currentTableInfo}
      />
    </>

  );
};

export default GameLayout;