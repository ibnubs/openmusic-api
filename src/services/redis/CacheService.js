const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      url: `redis://${process.env.REDIS_SERVER}:6379`
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    // Add connection handling
    this._client.connect()
      .then(() => console.log('Connected to Redis'))
      .catch((err) => console.error('Redis connection failed:', err));
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.setEx(key, expirationInSeconds, value);
  }

  async get(key) {
    try {
      return await this._client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      return await this._client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      throw error;
    }
  }
}

module.exports = CacheService;
