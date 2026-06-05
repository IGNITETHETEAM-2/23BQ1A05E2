# Notification System Design

---

# Stage 1

## 1. Core Actions

* Create Notification
* Get User Notifications
* Mark Notification as Read
* Mark All as Read
* Delete Notification
* Get Unread Count

---

## 2. REST API Design

```http
POST    /api/notifications
GET     /api/notifications
GET     /api/notifications/:id
PATCH   /api/notifications/:id/read
PATCH   /api/notifications/read-all
DELETE  /api/notifications/:id
GET     /api/notifications/unread-count
```

---

## 3. Request / Response Contracts

### Request Example

```json
{
  "userId": "123",
  "title": "Service Reminder",
  "message": "Your vehicle service is due.",
  "type": "reminder"
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "id": "n101",
    "title": "Service Reminder"
  }
}
```

---

## 4. Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 5. Real-Time Notification Design

### Architecture

```
Client ↔ WebSocket ↔ Notification Server
```

or using **Socket.IO**:

```
Client ↔ Socket.IO ↔ Notification Server
```

### Flow

```
New Notification
      ↓
Store in DB
      ↓
Emit Socket Event
      ↓
Frontend Updates Instantly
```

---

# Stage 2

## 1. Database Choice

**Recommended: MongoDB**

| Reason            | Detail                                 |
|-------------------|----------------------------------------|
| JSON-based        | Maps directly to JavaScript objects    |
| Flexible schema   | Easy to add/remove fields              |
| Fast reads/writes | Optimised for high-throughput workloads|
| Easy scaling      | Built-in horizontal scaling support    |

---

## 2. Schema

```javascript
Notification {
  _id,        // ObjectId - unique identifier
  userId,     // ObjectId - reference to User
  title,      // String   - notification title
  message,    // String   - notification body
  type,       // String   - "reminder" | "info" | "warning" | "error" | "success"
  isRead,     // Boolean  - read status (default: false)
  createdAt   // Date     - auto-generated timestamp
}
```

---

## 3. Database Queries

### Create Notification

```javascript
db.notifications.insertOne({
  userId: "123",
  title: "Service Reminder",
  message: "Your vehicle service is due.",
  type: "reminder",
  isRead: false,
  createdAt: new Date()
})
```

### Get All Notifications for a User

```javascript
db.notifications.find({ userId })
```

### Get Unread Count

```javascript
db.notifications.countDocuments({
  userId,
  isRead: false
})
```

### Mark Notification as Read

```javascript
db.notifications.updateOne(
  { _id },
  { $set: { isRead: true } }
)
```

### Mark All as Read

```javascript
db.notifications.updateMany(
  { userId, isRead: false },
  { $set: { isRead: true } }
)
```

### Delete Notification

```javascript
db.notifications.deleteOne({ _id })
```

---

## 4. Scaling Challenges

* **Large notification volume** — millions of records accumulate over time
* **Slow queries** — unindexed lookups on large collections degrade performance
* **Increased storage** — historical notifications consume growing disk space

---

## 5. Solutions

| Problem                  | Solution                                |
|--------------------------|-----------------------------------------|
| Slow `userId` lookups    | Index on `userId`                       |
| Slow time-based queries  | Index on `createdAt`                    |
| Large result sets        | Pagination (limit + skip / cursor)      |
| Storage bloat            | Archive old notifications to cold store |
| High write throughput    | Database sharding by `userId`           |

```javascript
// Recommended Indexes
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ createdAt: -1 })
db.notifications.createIndex({ userId: 1, isRead: 1 })
```
