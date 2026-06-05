import React from 'react';
import NotificationItem from './NotificationItem';
import notificationService from '../services/notificationService';

const NotificationList = ({ notifications, onClose, onRefresh }) => {
  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => notificationService.markAsRead(n._id)));
    onRefresh();
  };

  return (
    <div
      id="notification-dropdown"
      style={{
        position: 'absolute',
        right: 0,
        top: '110%',
        width: '350px',
        background: '#1e1e2e',
        border: '1px solid #3f3f5a',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #3f3f5a' }}>
        <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem' }}>Notifications</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button id="mark-all-read-btn" onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem' }}>
            Mark all read
          </button>
          <button id="close-notifications-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
        </div>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '24px' }}>No notifications yet</p>
        ) : (
          notifications.map((n) => <NotificationItem key={n._id} notification={n} onRefresh={onRefresh} />)
        )}
      </div>
    </div>
  );
};

export default NotificationList;
