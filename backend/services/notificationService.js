const Notification = require('../models/Notification');
const sendWebPush = require('./webPushService');
const { getChannel } = require('../config/rabbitmq');

const connectedUsers = new Map();

/* ---------- PROCESS 1 notification ---------- */
const process = async (data) => {
  console.log('🔄 PROCESS: Starting notification processing...');
  console.log('📊 PROCESS: Current connected users:', Array.from(connectedUsers.keys()));

  // 1) Save to DB
  const notification = new Notification(data);
  await notification.save();
  console.log('💾 PROCESS: Notification saved to database');

  // 2) Decide real-time vs push
  const { toUser, type, fromUser, message } = data;
  console.log(`🎯 PROCESS: Target user: ${toUser}`);

  const socketId = connectedUsers.get(toUser);
  console.log(`🔍 PROCESS: Looking for user ${toUser}, found socket: ${socketId}`);

  if (socketId) {
    const io = require('../socket/handler').getIO();
    io.to(socketId).emit('new_notification', {
      id: notification._id,
      type,
      fromUser,
      message,
      timestamp: notification.timestamp
    });
    console.log(`✅ PROCESS: WebSocket emit completed`);

    notification.delivered = true;
    await notification.save();
    console.log('✅ PROCESS: Notification marked as delivered in database');
  } else {
    console.log(`📱 PROCESS: User ${toUser} offline, attempting web push`);
    await sendWebPush(toUser, {
      title: `New ${type}`,
      body: message,
      icon: '/notification-icon.png',
      badge: '/badge-icon.png'
    });
    console.log('📱 PROCESS: Web push notification sent');
  }
  console.log('🎉 PROCESS: Notification processing completed successfully');
};

/* ---------- CONSUME all queues ---------- */
const consume = async () => {
  console.log('🐰 Starting to consume notifications...');
  const channel = getChannel();
  const queues = ['likes_queue', 'comments_queue', 'shares_queue'];

  queues.forEach(async (q) => {
    console.log(`👂 Setting up consumer for: ${q}`);
    await channel.consume(q, async (msg) => {
      if (msg) {
        console.log(`📬 CONSUMER: Received message from ${q}`);
        console.log(`📄 CONSUMER: Message content:`, msg.content.toString());
        await process(JSON.parse(msg.content.toString()));
        channel.ack(msg);
        console.log(`✅ CONSUMER: Message acknowledged`);
      }
    });
    console.log(`✅ Consumer set up for ${q}`);
  });
};

module.exports = { process, consume, connectedUsers };