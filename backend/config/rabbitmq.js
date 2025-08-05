const amqp = require('amqplib');
require('dotenv').config();
let channel;

const connect = async () => {
  try {
    console.log('🐰 Connecting to RabbitMQ...');
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();

    console.log('🐰 RabbitMQ connected, creating queues...');
    const queues = ['likes_queue', 'comments_queue', 'shares_queue'];
    for (const q of queues) await channel.assertQueue(q, { durable: true });

    console.log('✅ All queues created successfully');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection failed:', error);
    process.exit(1);
  }
};

const getChannel = () => channel;
module.exports = { connect, getChannel };