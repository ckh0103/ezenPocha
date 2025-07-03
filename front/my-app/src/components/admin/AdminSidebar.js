// --- START OF FILE components/admin/AdminSidebar.js ---
import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <span>EZEN 포차</span>
                <span className="admin-logo-subtitle">Admin</span>
            </div>
            <div className="admin-search-bar">
                <input type="text" placeholder="검색..." />
                <button>🔍</button>
            </div>
            <nav className="admin-sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "active" : ""}>
                            테이블 현황 {/* 이미지의 '테이블&예약현황'과 유사하게 */}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/menu" className={({isActive}) => isActive ? "active" : ""}>
                            메뉴 관리
                        </NavLink>
                    </li>

                    {/* <li><NavLink to="/admin/orders">주문 통계</NavLink></li> */}
                    {/* <li><NavLink to="/admin/settings">설정</NavLink></li> */}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
// --- END OF FILE components/admin/AdminSidebar.js ---