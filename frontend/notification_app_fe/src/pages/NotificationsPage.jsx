import React, { useState, useEffect } from 'react';
import NotificationItem from '../components/NotificationItem';
import notificationService from '../services/notificationService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const userId = localStorage.getItem('userId') || 'demo-user';

  const fetchNotifications = async () => {
    const data = await notificationService.getNotifications(userId);
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#e2e8f0', fontFamily: 'Inter, sans-serif', padding: '32px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ color: '#818cf8', marginBottom: '8px' }}>🔔 All Notifications</h1>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              id={`filter-${f}-btn`}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid #3f3f5a',
                background: filter === f ? '#818cf8' : 'transparent',
                color: filter === f ? '#fff' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ background: '#1e1e2e', borderRadius: '12px', border: '1px solid #3f3f5a', overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>No notifications found</p>
          ) : (
            filtered.map((n) => <NotificationItem key={n._id} notification={n} onRefresh={fetchNotifications} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
