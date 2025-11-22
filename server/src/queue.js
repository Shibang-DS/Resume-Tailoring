const Queue = require('bull');

const tailorQueue = new Queue('tailor-queue', process.env.REDIS_URI || 'redis://localhost:6379');

module.exports = tailorQueue;
