import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminMenuManagement from './AdminMenuManagement';
import AdminDashboard from './AdminDashboard';

const AdminLayout = ({ menuItems, categoriesData, onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
    return (
        <div className="admin-app">
            <AdminSidebar />
            <main className="admin-main-content">
                <Routes>
                    <Route
                        path="dashboard"
                        element={<AdminDashboard />}
                    />
                    <Route
                        path="menu"
                        element={
                            <AdminMenuManagement
                                menuItems={menuItems}
                                categories={categoriesData}
                                onAddMenuItem={onAddMenuItem}
                                onUpdateMenuItem={onUpdateMenuItem}
                                onDeleteMenuItem={onDeleteMenuItem}
                            />
                        }
                    />
                    <Route index element={<Navigate to="dashboard" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminLayout;