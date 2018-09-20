'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const plugins = require('./plugins')

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const hotkeys = {
  'jig': 'https://www.instagram.com/modela_asia',
  'jstudy': 'https://softnshare.com/category/freecourse/'
};

function scanHotkeys({text}) {
  return hotkeys[text] || text;
}

// event handler
function handleEvent(event) {
  console.log(JSON.stringify(event, null, 4));

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  const text = scanHotkeys(event.message);

  for(var i = 0 ; i < plugins.length ; i++) {
    const {filter, action} = plugins[i];
    if ( text.indexOf(filter) != -1) return action(text)
      .then(msg => client.replyMessage(event.replyToken, msg));
  }

  return null;
}

// listen on port
const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
