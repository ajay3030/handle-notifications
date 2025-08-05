const mongoose = require('mongoose');
require('dotenv').config();
module.exports = () =>
  mongoose.connect('mongodb+srv://root:root@cluster0.xfasxpz.mongodb.net/notification_system?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
