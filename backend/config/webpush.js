const webPush = require('web-push');
require('dotenv').config();
webPush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
module.exports = webPush;
