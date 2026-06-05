import React from 'react';
import notificationService from '../services/notificationService';

const typeColors = {
  info: '#818cf8',
  warning: '#f59e0b',
  error: '#ef4444',
  success: '#10b981',
};

const typeIcons = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
};

const NotificationItem = ({ notification, onRefresh }) => {
  const handleMarkRead = async () => {
    if (!notification.isRead) {
      await notificationService.markAsRead(notification._id);
      onRefresh();
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await notificationService.deleteNotification(notification._id);
    onRefresh();
  };

  return (
    <div
      onClick={handleMarkRead}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #2d2d44',
        background: notification.isRead ? 'transparent' : 'rgba(129, 140, 248, 0.05)',
        cursor: 'pointer',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{typeIcons[notification.type] || 'ℹ️'}</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, color: typeColors[notification.type] || '#e2e8f0', fontWeight: notification.isRead ? 400 : 600, fontSize: '0.9rem' }}>
          {notification.title}
        </p>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>{notification.message}</p>
        <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '0.7rem' }}>
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={handleDelete}
        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '0 4px' }}
        aria-label="Delete notification"
      >
        🗑️
      </button>
    </div>
  );
};

export default NotificationItem;
