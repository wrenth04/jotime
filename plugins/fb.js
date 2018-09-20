const axios = require('axios');
const cheerio = require('cheerio');
const {imgwall} = require('./utils');

const filter = 'facebook';
module.exports = {filter, action};

function action(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => {
      const type = $('meta[property="og:type"]').attr('content');
      switch(type) {
        case 'video': return video($);
        default: return null;
      }
    });
}

function video($) {
  const img = $('meta[property="og:image"]').attr('content').replace('&amp;', '&');
  const uri = $('meta[property="og:video"]').attr('content').replace('&amp;', '&');
  return {
    "type": "video",
    "originalContentUrl": uri,
    "previewImageUrl": img
  };
}

