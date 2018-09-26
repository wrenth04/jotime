
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
  port: process.env.PORT ||800,
  dbHost: process.env.DB
};

module.exports = config;
