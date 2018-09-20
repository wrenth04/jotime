const axios = require('axios');
const {debug, ssl} = require('./utils');

const filter = '17app.co';
module.exports = {filter, action};

function action(uri) {
  return axios.post('https://api-dsa.17app.co/api/v1/liveStreams/getSuggestedLiveStreams', {"region":"global","count":10})
    .then(res => res.data.data)
    .then(data => JSON.parse(data).sort((a, b) => b.liveViewerCount - a.liveViewerCount))
    .then(data => data.slice(0, 9).map(user => {
      const {userID, rtmpUrls, coverPhoto,} = user;
      const {picture, roomID, displayName, bio, website} = user.userInfo;
      const rtmp = rtmpUrls[0].url;
      return {
        userID,
        rtmp: rtmpUrls[0].url, 
        cover: ssl(coverPhoto),
        picture,
        room: `https://17.media/share/live/${roomID}`,
        profile: `https://17.live/profile/r/${roomID}`,
        name: displayName,
        roomID,
        bio,
        website
      };
    }))
    .then(data => ({
      type: 'template',
      altText: '17media top 10',
      template: {
        type: 'carousel',
        columns: data.map(({name, bio, website, cover, rtmp, room, profile, roomID}) => ({
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
          }, websiteBtn({website, room, profile})
          ]
        }))
      }
    }));
}

function websiteBtn({website, room, profile}) {
  website = website.replace(/.*http/, 'http').split(' ')[0]
  var label = 'profile';
  var uri = profile;
  ['facebook', 'instagram', 'twitter'].forEach(key => {
    if(website.indexOf(key) != -1) {
      label = key;
      uri = website;
    }
  });

  const w = website.toLowerCase();
  if(w.indexOf('ig:') != -1) {
    label = 'instagram';
    uri = 'https://www.instagram.com/' + w.split('ig:')[1].replace(/ /g, '');
  }
  if(w.indexOf('fb:') != -1) {
    label = 'facebook';
    uri = 'https://www.facebook.com/' + w.split('fb:')[1].replace(/ /g, '');
  }

  return label == 'profile' ? {
    type: 'message', label, text: uri
  } : {
    type: 'uri', label, uri
  };
}
