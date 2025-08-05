const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  type: { type: String, required: true },
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  postId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false }
});
module.exports = mongoose.model('Notification', schema);
