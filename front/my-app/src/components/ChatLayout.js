import React from 'react';
import TableOverviewCard from './admin/TableOverviewCard'; // 이 경로도 다시 확인해주세요.

const ChatLayout = ({ tables, onOpenChatRequest, currentTableInfo }) => {
  // 현재 본인 테이블은 채팅 대상에서 제외합니다.
  const otherTables = tables.filter(table => table.id !== currentTableInfo.id);

  return (
    <div className="chat-layout">
      <h2>누구와 대화를 시작할까요?</h2>
      <p>대화 할 테이블을 선택해주세요.</p>
      <div className="menu-grid"> {/* menu-grid 스타일을 재활용 */}
        {otherTables.length > 0 ? (
          otherTables.map((table) => {
            // EzenTable의 'name' 필드를 사용
            const genderInfo = `남${table.genderCount.male} / 여${table.genderCount.female}`;
            const imageText = encodeURIComponent(`${table.name}\n${genderInfo}`); // table.name 사용
            const imageUrl = `https://placehold.co/150x120/34495e/ecf0f1?text=${imageText}&font=noto-sans-kr`;

            return (
              <div
                key={table.id} // key는 table.id (고유값)
                className="menu-item" // menu-item 스타일 재활용
                onClick={() => onOpenChatRequest(table)}
              >
                <img src={imageUrl} alt={table.name} /> {/* alt도 table.name 사용 */}
                <div className="item-name">{table.name}</div> {/* table.name 사용 */}
                <div className="item-price">{genderInfo}</div>
              </div>
            );
          })
        ) : (
          <p>현재 대화 가능한 테이블이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;