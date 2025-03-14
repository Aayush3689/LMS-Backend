
// ======================redis integration====================== //
const { createClient } = require("redis");

const connectRedis = async () => {
  try {
    const client = createClient({
      username: "default",
      password: "X1XnyYL8EUyzrNcUZaOmkqGO2hDvLcPL",
      socket: {
        host: "redis-15206.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
        port: 15206,
      },
    });
    client.on("error", (err) => console.log(`Redis Client Error: ${err}`));
    await client.connect();
    return client;
  } catch (error) {
    console.log(`Radis connection error: ${error}`);
    throw error;
  }
};

// ========================== //
module.exports = connectRedis;
