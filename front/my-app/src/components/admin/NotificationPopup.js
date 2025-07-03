import React, { useEffect } from 'react';
import '../../styles/admin/NotificationPopup.css';

const NotificationPopup = ({ notification, onClose }) => {
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    if (!notification) {
        return null;
    }

    return (
        <div className="notification-popup-overlay">
            <div className="notification-popup-content">
                <div className="notification-header">
                    <span className="notification-icon">🔔</span>
                    <h2>직원 호출</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="notification-body">
                    <p className="table-number">{notification.tableNumber}</p>
                    <p className="message">{notification.message}</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
