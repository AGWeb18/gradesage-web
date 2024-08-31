import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://default:Acl2AAIjcDFhZDIwZGNkNzE2ZmU0OTBmYWQ4YTA2YzA3NmEwNDZlNnAxMA@smooth-pup-51574.upstash.io:6379');

export { redis };

