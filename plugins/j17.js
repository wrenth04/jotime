const axios = require('axios');

const filter = '17app.co';
module.exports = {filter, action};

function action(uri) {
  return axios.post('https://api-dsa.17app.co/api/v1/liveStreams/getSuggestedLiveStreams', {"region":"global","count":10})
    .then(res => res.data.data)
    .then(data => JSON.parse(data).sort((a, b) => b.liveViewerCount - a.liveViewerCount))
    .then(data => data.slice(0, 9).map(user => {
      //console.log(JSON.stringify(user, null, 2));
      const {userID, rtmpUrls, coverPhoto,} = user;
      const {picture, roomID, displayName, bio, website} = user.userInfo;
      const rtmp = rtmpUrls[0].url;
      return {
        userID,
        rtmp: rtmpUrls[0].url, 
        cover: 'https://ssl-proxy.my-addr.org/myaddrproxy.php/http/'+coverPhoto.replace('http:/', ''),
        picture,
        room: `https://17.media/share/live/${roomID}`,
        name: displayName,
        roomID,
        bio,
        website: website.replace(/.*http/, 'http')
      };
    }))
    .then(data => ({
      type: 'template',
      altText: '17media hot',
      template: {
        type: 'carousel',
        columns: data.map(({name, bio, website, cover, rtmp, room, roomID}) => ({
          text: name,
          thumbnailImageUrl: cover,
          actions: [{
            type: 'uri',
            label: `room(${roomID})`,
            uri: room
          }, {
            type: 'uri',
            label: 'live stream',
            uri: rtmp 
          }, {
            type: 'uri',
            label: 'website',
            uri: website.length > 0 && website.indexOf('http') == 0 ? website : room
          }]
        }))
      }
    }));
    //.then(json => JSON.stringify(json, null, 2));
}

