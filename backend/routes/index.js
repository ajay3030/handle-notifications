const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
router.post('/notifications/send', ctrl.send);
router.post('/push/subscribe', ctrl.subscribe);
router.get('/notifications/:userId', ctrl.list);
router.post('/notifications/bulk', ctrl.bulk);
module.exports = router;
