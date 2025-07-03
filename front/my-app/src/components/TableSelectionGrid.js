import React from 'react';
import TableOverviewCard from './admin/TableOverviewCard';

const TableSelectionGrid = ({ tables, onTableSelect, currentTableId }) => {
  // 현재 본인 테이블이 아니고, status가 'EMPTY'가 아닌 테이블만 필터링합니다.
  // EzenTable의 name 필드를 사용하도록 수정
  const availableTables = tables.filter(table =>
    table.id !== currentTableId && (table.status === 'OCCUPIED' || table.status === '주문 완료')
  );

  return (
    <div className="table-status-grid">
      {availableTables.length > 0 ? (
        availableTables.map((table) => (
          // key를 table.id로 변경 (테이블 ID는 고유함)
          <div key={table.id} onClick={() => onTableSelect(table)} style={{ cursor: 'pointer' }}>
            <TableOverviewCard tableData={table} />
          </div>
        ))
      ) : (
        <p>현재 게임을 신청할 수 있는 다른 테이블이 없습니다.</p>
      )}
    </div>
  );
};

export default TableSelectionGrid;