const axios = require('axios');
const {debug, imgwall} = require('./utils');

const filter = '17.live';
module.exports = {filter, action};

function action(uri) {
  const liveStreamID = uri.split('/r/')[1].split('/')[0] || null;
  if(!liveStreamID) return null;
  return axios.post('https://api-dsa.17app.co/api/v1/liveStreams/getLiveStreamInfo', {liveStreamID})
    .then(res => JSON.parse(res.data.data))
    .then(({userID, userInfo}) => {
      const data = {
        action: 'getUserPost',
        targetUserID: userID,
        count: 10,
        beforeTime: Math.floor(Date.now()/1000)
      };
      console.log(data);
      return axios.post('https://api-dsa.17app.co/apiGateWay', {cypher: '0_v2', data: JSON.stringify(data)})
    })
    .then(res => JSON.parse(res.data.data))
    .then(posts => posts.map(p => ({
      src: `https://assets-17app.akamaized.net/${p.picture}`,
      link: `https://assets-17app.akamaized.net/${p.picture}`
    })))
    .then(imgs => ({imgs, title: uri}))
    .then(imgwall);
}
