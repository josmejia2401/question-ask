// utils/redisClient.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('connect', () => {
    console.log('✅ Redis conectado');
});
redis.on('error', (err) => {
    console.error('❌ Error de Redis:', err);
});
module.exports = redis;
