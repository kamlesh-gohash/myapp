const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'myuser',
  host: 'postgres',
  database: 'myappdb',
  password: 'mypassword',
  port: 5432,
});

const redisClient = redis.createClient({
  socket: {
    host: 'redis',
    port: 6379
  }
});

redisClient.on('error', err => console.error('Redis Error:', err));

(async () => {
  await redisClient.connect();
})();

app.get('/', async (req, res) => {
  const pgRes = await pool.query('SELECT NOW()');
  const redisRes = await redisClient.get('visited');

  res.json({
    postgresTime: pgRes.rows[0].now,
    redisValue: redisRes
  });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
