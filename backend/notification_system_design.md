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

---

# Stage 5

## Problems in Current Design

```
for student_id in student_ids:
    send_email()
    save_to_db()
    push_to_app()
```

Issues:

- ❌ Sequential processing (slow for 50,000 users)
- ❌ If email fails midway, system becomes inconsistent
- ❌ Single point of failure
- ❌ Long response time
- ❌ No retry mechanism

### What if Email Fails for 200 Students?

Current system:

```
49800 students notified
200 students missed
```

No way to recover automatically.

## Better Architecture

```
HR Clicks Notify All
        ↓
Create Notification Job
        ↓
Message Queue
(Kafka / RabbitMQ)
        ↓
Worker Pool
        ↓
├── Save Notification
├── Send Email
└── Push In-App Alert
```

## Should DB Save and Email Happen Together?

❌ No

Reason:

- Email service may fail
- DB save should succeed independently
- Notification record should exist even if email fails

Use:

```
Save to DB
      ↓
Publish Event
      ↓
Email Worker
      ↓
Retry if Failed
```

## Revised Pseudocode

```
def notify_all(student_ids, message):

    for student_id in student_ids:

        notification = save_to_db(
            student_id,
            message,
            status="PENDING"
        )

        queue.publish({
            "notificationId": notification.id
        })
```

Worker:

```
def worker():

    while True:

        job = queue.consume()

        try:
            send_email(job.notificationId)
            push_to_app(job.notificationId)

            update_status(
                job.notificationId,
                "SENT"
            )

        except Exception:

            retry(job)
```

## Benefits

- ✅ Fast
- ✅ Scalable
- ✅ Retry support
- ✅ Fault tolerant
- ✅ Handles 50,000+ users

---

# Stage 6

## Requirement

Show Top **10 unread notifications** based on:

```
Priority =
Weight + Recency
```

Weights:

```
Placement = 3
Result    = 2
Event     = 1
```

## JavaScript Solution

```
function getTopNotifications(notifications, n = 10) {

  const weights = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  return notifications
    .filter(n => !n.isRead)
    .map(notification => {

      const days =
        (Date.now() -
        new Date(notification.createdAt))
        / (1000 * 60 * 60 * 24);

      const score =
        weights[notification.type] * 100
        - days;

      return {
        ...notification,
        score
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}
```

### Example

```
const notifications = [
  {
    id: 1,
    type: "Placement",
    isRead: false,
    createdAt: "2025-06-04"
  },
  {
    id: 2,
    type: "Event",
    isRead: false,
    createdAt: "2025-06-05"
  }
];

console.log(
  getTopNotifications(notifications)
);
```

### Explanation

- Placement > Result > Event
- Recent > Older
- Unread only
- Return Top 10

## Submission Notes

- Stage 5: Problems in Current Design, Reliable Architecture, Queue-Based Solution, Revised Pseudocode
- Stage 6: Priority Formula, JavaScript Implementation, Complexity Analysis

```javascript
// Recommended Indexes
db.notifications.createIndex({ userId: 1 })
db.notifications.createIndex({ createdAt: -1 })
db.notifications.createIndex({ userId: 1, isRead: 1 })
```

---

# Stage 3

## Query Analysis

### Current Query

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is it Accurate?

✅ Yes — it correctly fetches unread notifications for student `1042`.

---

### Why is it Slow?

**Database Size:**

* 50,000 Students
* 5,000,000 Notifications

**Issues:**

1. **`SELECT *`** — Fetches all columns unnecessarily, increasing I/O.
2. **No proper index** — Database performs a full table scan across millions of rows.
3. **Sorting (`ORDER BY createdAt`)** — Expensive without a supporting index.

---

## Optimization

### Recommended Index

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt);
```

**Benefits:**

* Faster filtering on `studentID` and `isRead`
* Faster sorting on `createdAt`
* Avoids full table scans entirely

---

### Optimized Query

```sql
SELECT notificationID,
       title,
       message,
       createdAt
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt DESC
LIMIT 50;
```

---

## Computational Complexity

| Scenario            | Complexity | Description                    |
|---------------------|------------|--------------------------------|
| Without Index       | O(N)       | Scans all 5,000,000 rows       |
| With Composite Index| O(log N)   | Direct B-tree lookup, much faster |

---

## Should We Add Indexes on Every Column?

❌ **No.**

**Problems with over-indexing:**

* Consumes more storage
* Slows down `INSERT` / `UPDATE` / `DELETE` operations
* Unused indexes waste memory and CPU

**Use indexes only on columns used in frequent queries:**

```text
studentID       → filtering by user
isRead          → filtering unread notifications
createdAt       → sorting and time-range queries
notificationType → filtering by type
```

---

## Placement Notification Query

### Students who received Placement notifications in the last 7 days

**MySQL:**

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
  AND createdAt >= NOW() - INTERVAL 7 DAY;
```

**PostgreSQL:**

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
  AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```
