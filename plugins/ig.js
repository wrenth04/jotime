const axios = require('axios');
const md5 = require('md5');
const cheerio = require('cheerio');
const {imgwall, debug} = require('./utils');

const QUERY_HASH = '42323d64886122307be10013ad2dcc44';

// 'https://www.instagram.com/' + username
const hotkeys = {
  'jig': 'https://www.instagram.com/modela_asia',
  'jig2': 'https://www.instagram.com/bbmanworld/',
  'bbig': 'https://www.instagram.com/bbmanworld/',
  'jig3': 'https://www.instagram.com/jkftaipei/',
  'jkfig': 'https://www.instagram.com/jkftaipei/'
};
const filter = 'instagram';
module.exports = {filter, action, hotkeys};

function action(uri) { 
  return (uri.indexOf('/p/') == -1 ? home(uri) : post(uri));
}

function photoold(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => $('meta[property="og:image"]').attr('content'))
    .then(img => [{src: img}]);
}

function post(uri) {
  return axios.get(uri)
    .then(res => {
      const json = JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]);
      const $ = cheerio.load(res.data);
      const type = $('meta[property="og:type"]').attr('content');
      switch(type){
        case 'video': return video($);
        case 'instapp:photo': return imgwall({title: uri, imgs:photo(json)});
      }
    });
}

function photo(json){
  const {shortcode_media} = json.entry_data.PostPage[0].graphql;
  if(shortcode_media.edge_sidecar_to_children)
    return shortcode_media.edge_sidecar_to_children.edges.map(({node}) => ({src: node.display_url}));
  else
    return [{src: shortcode_media.display_url}];
}

function video($) {
  const img = $('meta[property="og:image"]').attr('content');
  const uri = $('meta[property="og:video"]').attr('content');
  return {
    "type": "video",
    "originalContentUrl": uri,
    "previewImageUrl": img
  };
}

function home(uri) {
  return axios.get(uri)
  .then(res => JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]))
  .then(json => json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges)
  .then(json => json.map(({node}) => {
    const src = node.display_url;
    const tags = node.edge_media_to_caption.edges.map(({node}) => node.text);
    var i = 1;
    if(tags.length > 0 && tags[0].indexOf('@') != -1) {
      const tag = tags[0].split('@')[1].split(' ')[0].split('\n')[0];
      const link = 'https://www.instagram.com/' + tag;
      const text = tag.length < 12 ? tag : tag.substring(0, 9) + '...';
      return {src, link, text, type: 'instagram'};
    }
    return {src};
  }))
  .then(imgs => imgwall({title: uri, imgs}));
}

function homeold(uri) {
  return axios.get(uri)
  .then(res => JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]))
  .then(json => {
    return {
      userId: json.entry_data.ProfilePage[0].graphql.user.id,
      rhx: json.rhx_gis
    };
  })
  .then(data => graphql(data))
  .then(json => json.data.user.edge_owner_to_timeline_media.edges.map(edge => edge.node.display_url));
}

function graphql({userId, rhx}) {
  const q = `{"id":"${userId}","first":10,"after":null}`;
  const hash = md5(`${rhx}:${q}`);
  const uri = `https://www.instagram.com/graphql/query/?query_hash=${QUERY_HASH}&variables=${q}`;
  return axios.get(uri, {headers: {'x-instagram-gis': hash}})
    .then(res => res.data);
}

