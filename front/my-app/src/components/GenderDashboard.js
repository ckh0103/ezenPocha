import React from 'react';

// 테이블 하나의 정보를 표시하는 작은 컴포넌트
const TableGenderInfo = ({ table }) => {
  const { tableNumber, status, genderCount } = table;
  const isOccupied = status !== '자리 비음' && genderCount;

  return (
    <div className={`gender-info-card ${isOccupied ? 'occupied' : 'empty'}`}>
      <div className="gender-info-table-number">{tableNumber}</div>
      <div className="gender-info-details">
        {isOccupied ? (
          <>
            <div className="gender-count male">
              <span className="gender-icon">👨</span>
              <span>{genderCount.male}</span>
            </div>
            <div className="gender-count female">
              <span className="gender-icon">👩</span>
              <span>{genderCount.female}</span>
            </div>
          </>
        ) : (
          <div className="empty-status">자리 비음</div>
        )}
      </div>
    </div>
  );
};

// 전체 테이블 현황을 표시하는 대시보드
const GenderDashboard = ({ tableOrders }) => {
  if (!tableOrders || tableOrders.length === 0) {
    return <div className="gender-dashboard"><p>테이블 정보를 불러올 수 없습니다.</p></div>;
  }

  return (
    <div className="gender-dashboard">
      <h2 className="dashboard-title">다른 테이블 성비 현황</h2>
      <div className="gender-info-grid">
        {tableOrders.map(table => (
          <TableGenderInfo key={table.tableNumber} table={table} />
        ))}
      </div>
      <div className="dashboard-footer">
        * 마음에 드는 테이블에 합석 신청을 해보세요!
      </div>
    </div>
  );
};

export default GenderDashboard;