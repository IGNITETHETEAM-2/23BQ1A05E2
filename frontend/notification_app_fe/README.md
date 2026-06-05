# Notification App - Frontend

A React-based frontend for managing real-time notifications, integrated with the notification backend API.

## Features

- 🔔 Notification bell with unread badge count
- 📋 Dropdown list of notifications with read/delete actions
- 📄 Full notifications page with filter (all / unread)
- 🎨 Dark mode UI with color-coded notification types
- ⏱️ Auto-polling every 30 seconds

## Installation

```bash
cd notification_app_fe
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the App

```bash
# Development server
npm run dev

# Production build
npm run build
```

## Project Structure

```
notification_app_fe/
├── src/
│   ├── components/
│   │   ├── NotificationBell.jsx
│   │   ├── NotificationList.jsx
│   │   └── NotificationItem.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── NotificationsPage.jsx
│   ├── services/
│   │   └── notificationService.js
│   └── app.js
├── package.json
└── README.md
```
