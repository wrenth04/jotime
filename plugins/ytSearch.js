const {debug} = require('./utils');
const youtube = require('./youtube');

const filter = 'yt-';
module.exports = {filter, action};

function action(msg) {
  const keyword = encodeURIComponent(msg.split('-')[1]);
  const uri = `https://www.youtube.com/results?search_query=${keyword}`;
  return youtube.action(uri);
}
