# Notification System Design

## Overview

This document outlines the frontend architecture and UI design for the notification system.

---

## Frontend Components

```
notification_app_fe/
├── src/
│   ├── components/
│   │   ├── NotificationBell.jsx     # Bell icon with unread count badge
│   │   ├── NotificationList.jsx     # Dropdown/panel listing notifications
│   │   ├── NotificationItem.jsx     # Single notification card
│   │   └── NotificationToast.jsx   # Toast popup for new notifications
│   ├── pages/
│   │   ├── Dashboard.jsx            # Main dashboard page
│   │   └── NotificationsPage.jsx   # Full notifications page
│   ├── services/
│   │   └── notificationService.js  # API calls to backend
│   └── App.jsx
```

---

## UI Flow

```
User opens app
     ↓
NotificationBell renders in navbar with badge count
     ↓
User clicks bell → NotificationList dropdown opens
     ↓
User clicks a notification → Marked as read (PUT /api/notifications/:id/read)
     ↓
User clicks "View All" → Navigates to NotificationsPage
```

---

## Notification Badge Design

- Red badge on bell icon showing unread count
- Auto-refreshes every 30 seconds via polling
- WebSocket real-time update support (future)

---

## API Integration

| Action               | Method | Endpoint                        |
|----------------------|--------|---------------------------------|
| Fetch notifications  | GET    | `/api/notifications/:userId`    |
| Mark as read         | PUT    | `/api/notifications/:id/read`   |
| Delete notification  | DELETE | `/api/notifications/:id`        |

---

## State Management

- Local React state with `useState` / `useEffect`
- Optional: Context API for global notification state
- Polling interval: 30 seconds for new notifications
