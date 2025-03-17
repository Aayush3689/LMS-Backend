const { createClient } = require( 'redis' );

const client = createClient({
  socket: {
    host: 'localhost', // Change to your Redis host if using a remote server
    port: 6379
  }
});

// Handle errors
client.on('error', (err) => console.error('Redis Client Error', err));

// Connect Redis once when the server starts
const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
};

// Function to set a key-value pair with optional expiry
const setRedisValue = async (key, value, expiry = null) => {
  await connectRedis();
  if (expiry) {
    await client.setEx(key, value, expiry); // Set with expiry
  } else {
    await client.set(key, value); // Set without expiry
  }
};

// Function to get a value by key
const getRedisValue = async (key) => {
  await connectRedis();
  return await client.get(key);
};

// Function to delete a key
const deleteRedisKey = async (key) => {
  await connectRedis();
  const isOtpDeleted = await client.del(key);
  return isOtpDeleted;
};


// Exporting functions to use in other files
module.exports =  { setRedisValue, getRedisValue, deleteRedisKey };

