// --- START OF FILE components/WelcomeModal.js ---
import React, { useState } from 'react';
import '../styles/Ezen.css'; // 기존 CSS 재사용을 위해 import

const WelcomeModal = ({ isOpen, onConfirm }) => {
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  // '확인' 버튼 클릭 시 실행될 함수
  const handleSubmit = () => {
    // 간단한 유효성 검사: 총 인원이 1명 이상이어야 함
    if (maleCount + femaleCount <= 0) {
      alert('총 인원은 1명 이상이어야 합니다.');
      return;
    }
    // 부모 컴포넌트(App.js)로부터 받은 onConfirm 함수를 호출하여 데이터 전달
    onConfirm({ male: maleCount, female: femaleCount });
  };

  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    // 'chat-modal-overlay' 클래스를 재사용하여 동일한 배경 효과 적용
    <div className="chat-modal-overlay">
      {/* 새로운 클래스를 부여하여 스타일링 */}
      <div className="welcome-modal-content">
        <h2>EZEN 포차에 오신 것을 환영합니다!</h2>
        <p>테이블의 인원을 입력해주세요.</p>
        
        <div className="welcome-form-group">
          <label htmlFor="male-count">남자</label>
          <input
            id="male-count"
            type="number"
            min="0"
            value={maleCount}
            onChange={(e) => setMaleCount(parseInt(e.target.value, 10) || 0)}
          />
        </div>

        <div className="welcome-form-group">
          <label htmlFor="female-count">여자</label>
          <input
            id="female-count"
            type="number"
            min="0"
            value={femaleCount}
            onChange={(e) => setFemaleCount(parseInt(e.target.value, 10) || 0)}
          />
        </div>

        <button className="welcome-confirm-btn" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
// --- END OF FILE components/WelcomeModal.js ---