import React, { useState, useEffect } from 'react';
import NotificationList from './NotificationList';
import notificationService from '../services/notificationService';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const data = await notificationService.getNotifications(userId);
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-bell" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', position: 'relative' }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            id="notification-badge"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <NotificationList
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onRefresh={fetchNotifications}
        />
      )}
    </div>
  );
};

export default NotificationBell;
