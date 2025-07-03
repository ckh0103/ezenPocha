import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom'; // Navigate 추가

// ... (기타 import)

// 1. props로 tableOrders 받기
const CustomerApp = ({ menuData, categoriesData, tableOrders, genderGameData, onOpenChat }) => {
    const { tableId } = useParams();

    // 2. 유효한 테이블 ID 목록을 미리 계산 (성능 최적화)
    const validTableIds = useMemo(() => {
        const parseTableId = (tableNumberString) => {
            const match = tableNumberString.match(/\d+/);
            return match ? match[0] : null;
        };
        return tableOrders.map(table => parseTableId(table.tableNumber)).filter(Boolean);
        // 결과 예시: ['1', '2', '3', '4', '5', '6']
    }, [tableOrders]);

    // 3. 현재 URL의 tableId가 유효한지 확인
    const isTableIdValid = validTableIds.includes(tableId);

    // --- 나머지 state 및 함수들 (기존과 거의 동일) ---
    const myTableNumber = `NO.${tableId}`;
    // ...

    // 4. 유효하지 않은 tableId인 경우, 첫 번째 유효한 테이블로 리디렉트
    if (!isTableIdValid) {
        console.warn(`잘못된 테이블 ID(${tableId}) 접근. 첫 번째 테이블로 리디렉션합니다.`);
        // validTableIds가 비어있지 않다면 첫 번째 ID로, 비어있다면 루트로 리디렉션
        const redirectTo = validTableIds.length > 0 ? `/table/${validTableIds[0]}` : '/';
        return <Navigate to={redirectTo} replace />;
    }

    // --- 유효한 경우에만 아래의 정상적인 앱 렌더링 ---
    return (
        <div className="App">
            {/* ... WelcomeModal 및 나머지 JSX ... */}
        </div>
    );
};

export default CustomerApp;