# Notification System Design

## Overview

This document describes the architecture and design of a scalable notification system supporting **email**, **push**, and **in-app** notification channels.

---

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│              (Web App / Mobile App / Admin Panel)                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST / WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│                    API Gateway / Load Balancer                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼──────────────────┐
        │                   │                  │
┌───────▼──────┐   ┌────────▼──────┐  ┌───────▼──────────┐
│  User Service │   │  Notification │  │  Vehicle Maint.  │
│              │   │   Service     │  │  Scheduler Svc   │
└───────┬──────┘   └────────┬──────┘  └───────┬──────────┘
        │                   │                  │
        └───────────────────▼──────────────────┘
                            │
                 ┌──────────▼──────────┐
                 │    Message Queue    │
                 │  (Redis / RabbitMQ) │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
  ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
  │ Email Worker │  │ Push Worker  │  │ In-App Worker│
  │ (Nodemailer) │  │ (FCM / APNs) │  │  (WebSocket) │
  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## Notification Types

| Type      | Channel      | Trigger                              |
|-----------|--------------|--------------------------------------|
| `info`    | In-App       | General updates                      |
| `warning` | In-App, Email| Upcoming maintenance due             |
| `error`   | Email, Push  | Critical system failure              |
| `success` | In-App       | Maintenance completed confirmation   |

---

## Data Models

### Notification
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "title": "string",
  "message": "string",
  "type": "info | warning | error | success",
  "isRead": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### User Notification Preferences
```json
{
  "userId": "ObjectId",
  "emailNotifications": "boolean",
  "pushNotifications": "boolean",
  "inAppNotifications": "boolean"
}
```

---

## API Design

### Create Notification
```
POST /api/notifications
Body: { userId, title, message, type }
Response: 201 { success: true, data: Notification }
```

### Get User Notifications
```
GET /api/notifications/:userId
Response: 200 { success: true, data: [Notification] }
```

### Mark as Read
```
PUT /api/notifications/:id/read
Response: 200 { success: true, data: Notification }
```

### Delete Notification
```
DELETE /api/notifications/:id
Response: 200 { success: true, message: "Notification deleted" }
```

---

## Delivery Flow

```
1. Event occurs (e.g., maintenance due soon)
      ↓
2. Service publishes event to Message Queue
      ↓
3. Notification Worker picks up event
      ↓
4. Check User Preferences
      ↓
5a. Send Email (if enabled) → via Nodemailer / SendGrid
5b. Send Push (if enabled) → via Firebase FCM
5c. Save In-App Notification → to MongoDB
      ↓
6. Mark notification as delivered
```

---

## Scalability Considerations

- **Horizontal scaling**: Workers can scale independently
- **Message Queue**: Decouples producers from consumers; handles burst traffic
- **Rate Limiting**: Prevent notification spam per user (max N/hour)
- **Retry Logic**: Failed deliveries are retried with exponential backoff
- **Read Receipts**: Track which notifications were opened

---

## Technology Stack

| Component     | Technology              |
|---------------|-------------------------|
| Backend API   | Node.js + Express       |
| Database      | MongoDB (Mongoose)      |
| Queue         | Redis / RabbitMQ        |
| Email         | Nodemailer / SendGrid   |
| Push          | Firebase FCM            |
| Real-time     | Socket.IO (WebSocket)   |
| Auth          | JWT (JSON Web Tokens)   |
| Scheduler     | node-cron               |
