import React from 'react';

const TableOverviewCard = ({ tableData }) => {
    // EzenTable 엔티티의 필드명에 맞춰 name, maleCount, femaleCount 사용
    const { name, status, maleCount, femaleCount } = tableData; // tableNumber 대신 name
    const isOccupied = status !== 'EMPTY' && (maleCount > 0 || femaleCount > 0);

    return (
        <div className={`table-overview-card ${isOccupied ? 'occupied' : 'empty'}`}>
            <div className="card-content">
                {isOccupied ? (
                    <div className="gender-info">
                        <span className="gender-male">남자 {maleCount}</span>
                        <span className="gender-divider">/</span>
                        <span className="gender-female">여자 {femaleCount}</span>
                    </div>
                ) : (
                    <div className="empty-info">
                        ? ? ?
                    </div>
                )}
            </div>
            <div className="card-footer">
                {name} {/* tableNumber 대신 name 사용 */}
            </div>
        </div>
    );
};

export default TableOverviewCard;