const Subscription = require('../models/Subscription');
const webPush = require('../config/webpush');

module.exports = async (userId, payload) => {
  try {
    const subscriptions = await Subscription.find({ userId });
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            JSON.stringify(payload)
          );
        } catch (error) {
          if (error.statusCode === 410) {
            await Subscription.findByIdAndDelete(sub._id);
          }
        }
      })
    );
  } catch (error) {
    console.error('Error sending web push notification:', error);
  }
};