import { useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { notifications as initialNotifications } from './data/notifications';
import { NotificationCard } from './components/NotificationCard';

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getTopNotifications(notifications, n = 10) {
  return notifications
    .filter((item) => !item.isRead)
    .map((notification) => {
      const days =
        (Date.now() - new Date(notification.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      const score = weights[notification.type] * 100 - days;
      return { ...notification, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

function AllNotifications({ notifications, onMarkRead, filterType }) {
  const list = notifications.filter((notification) =>
    filterType === 'All' ? true : notification.type === filterType
  );

  return (
    <section>
      <div className="section-header">
        <h2>All Notifications</h2>
        <p>{list.length} notification(s) found</p>
      </div>
      <div className="grid">
        {list.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </div>
    </section>
  );
}

function PriorityNotifications({ notifications, onMarkRead }) {
  const top = useMemo(() => getTopNotifications(notifications, 10), [notifications]);

  return (
    <section>
      <div className="section-header">
        <h2>Priority Notifications</h2>
        <p>Top 10 unread items ordered by importance and recency.</p>
      </div>
      <div className="grid">
        {top.length === 0 ? (
          <p className="empty-state">No unread priority notifications.</p>
        ) : (
          top.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>
    </section>
  );
}

function FilterNotifications({ notifications, onMarkRead }) {
  const [activeType, setActiveType] = useState('All');
  const filtered = notifications.filter((notification) =>
    activeType === 'All' ? true : notification.type === activeType
  );

  return (
    <section>
      <div className="section-header">
        <h2>Filter by Type</h2>
        <div className="filter-group">
          {['All', 'Placement', 'Result', 'Event'].map((type) => (
            <button
              key={type}
              className={activeType === type ? 'active-filter' : ''}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="grid">
        {filtered.length === 0 ? (
          <p className="empty-state">No notifications for this type.</p>
        ) : (
          filtered.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const pageTitle = (
    <header className="hero">
      <div>
        <p className="eyebrow">Stage 7 - Notifications Dashboard</p>
        <h1>Campus Notifications</h1>
        <p>
          View all notifications, filter by type, and see the top unread
          priority items.
        </p>
      </div>
      <div className="stats">
        <span>{notifications.length} total</span>
        <span>{unreadCount} unread</span>
      </div>
    </header>
  );

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <NavLink to="/" end>
            All
          </NavLink>
          <NavLink to="/priority">Priority</NavLink>
          <NavLink to="/filter">Filter</NavLink>
        </nav>
        <main>
          {pageTitle}
          <Routes>
            <Route
              path="/"
              element={
                <AllNotifications
                  notifications={notifications}
                  onMarkRead={markAsRead}
                />
              }
            />
            <Route
              path="/priority"
              element={
                <PriorityNotifications
                  notifications={notifications}
                  onMarkRead={markAsRead}
                />
              }
            />
            <Route
              path="/filter"
              element={
                <FilterNotifications
                  notifications={notifications}
                  onMarkRead={markAsRead}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
