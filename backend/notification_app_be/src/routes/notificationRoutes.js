const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// GET all notifications for a user
router.get('/:userId', notificationController.getNotifications);

// POST create a new notification
router.post('/', notificationController.createNotification);

// PUT mark a notification as read
router.put('/:id/read', notificationController.markAsRead);

// DELETE a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
