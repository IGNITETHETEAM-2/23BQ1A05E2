import './NotificationCard.css';

export function NotificationCard({ notification, onMarkRead }) {
  return (
    <article className={`card ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="card-header">
        <span className="badge type">{notification.type}</span>
        <span className={`badge status ${notification.isRead ? 'read-badge' : 'unread-badge'}`}>
          {notification.isRead ? 'Viewed' : 'New'}
        </span>
      </div>
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      <div className="card-footer">
        <span>{new Date(notification.createdAt).toLocaleString()}</span>
        {!notification.isRead && (
          <button className="mark-read" onClick={() => onMarkRead(notification.id)}>
            Mark as read
          </button>
        )}
      </div>
    </article>
  );
}
