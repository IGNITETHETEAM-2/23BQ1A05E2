# Notification App - Backend

A RESTful backend for managing real-time notifications built with Express.js and MongoDB.

## Features

- 🔐 User authentication with JWT
- 🔔 Create, read, and manage notifications per user
- ✅ Mark notifications as read
- 🗑️ Delete notifications
- 🛡️ Password hashing with bcrypt

## Installation

```bash
cd notification_app_be
npm install
```

## Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notification_app
JWT_SECRET=your_jwt_secret_here
```

## Running the App

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Users
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/users/register` | Register a new user  |
| POST   | `/api/users/login`    | Login and get token  |
| GET    | `/api/users/:id`      | Get user profile     |

### Notifications
| Method | Endpoint                       | Description                  |
|--------|--------------------------------|------------------------------|
| GET    | `/api/notifications/:userId`   | Get all user notifications   |
| POST   | `/api/notifications`           | Create a notification        |
| PUT    | `/api/notifications/:id/read`  | Mark notification as read    |
| DELETE | `/api/notifications/:id`       | Delete a notification        |

## Project Structure

```
notification_app_be/
├── src/
│   ├── controllers/
│   │   ├── notificationController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   ├── models/
│   │   ├── Notification.js
│   │   └── User.js
│   └── app.js
├── package.json
└── README.md
```
