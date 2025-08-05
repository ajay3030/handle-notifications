const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const { getChannel } = require('../config/rabbitmq');

exports.send = async (req, res) => {
  try {
    const { type, fromUser, toUser, postId, message } = req.body;
    const data = { type, fromUser, toUser, postId, message, timestamp: new Date() };
    const channel = getChannel();

    const queueName = `${type}s_queue`;
    console.log(`📤 API: Sending to queue: ${queueName}`);
    console.log(`📄 API: Message data:`, data);

    if (!channel) {
      console.error('❌ API: RabbitMQ channel not available!');
      return res.status(500).json({ error: 'Queue service unavailable' });
    }

    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
    res.json({ success: true, message: 'Notification queued' });
  } catch (e) {
    console.error('Error sending notification:', e);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    await Subscription.create({
      userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save subscription' });
  }
};

exports.list = async (req, res) => {
  try {
    const notifications = await Notification.find({ toUser: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.bulk = async (req, res) => {
  try {
    const { count, type = 'like', fromUser, toUser } = req.body;
    if (toUser) {
      console.log(`📊 BULK: Sending ${count} notifications FROM ${fromUser} TO ${toUser}`);
      const channel = getChannel();
      const promises = [];
      for (let i = 0; i < count; i++) {
        const data = {
          type,
          fromUser,
          toUser,
          postId: `post_${i}_${Date.now()}`,
          message: `Bulk notification ${i + 1}: ${fromUser} ${type}d your post`,
          timestamp: new Date()
        };
        promises.push(
          channel.sendToQueue(`${type}s_queue`, Buffer.from(JSON.stringify(data)), { persistent: true })
        );
      }
      await Promise.all(promises);
      console.log(`✅ BULK: ${count} notifications sent to specific user ${toUser}`);
      res.json({ success: true, message: `${count} notifications sent to ${toUser}` });
    }
  } catch (e) {
    console.error('Error sending bulk notifications:', e);
    res.status(500).json({ error: 'Failed to send bulk notifications' });
  }
};