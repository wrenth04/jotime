const axios = require('axios');
const md5 = require('md5');
const cheerio = require('cheerio');
const imgwall = require('./imgwall');

const QUERY_HASH = '42323d64886122307be10013ad2dcc44';

// 'https://www.instagram.com/' + username
const filter = 'instagram';

module.exports = {filter, action};
function action(uri) { 
    return (uri.indexOf('/p/') == -1 ? home(uri) : photo(uri)).then(imgs => imgwall({imgs, title: uri}))
  }

function photoold(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => $('meta[property="og:image"]').attr('content'))
    .then(img => [{src: img}]);
}

function photo(uri) {
  return axios.get(uri)
    .then(res => JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]))
    .then(json => json.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges.map(({node}) => ({src: node.display_url})));
}

function home(uri) {
  return axios.get(uri)
  .then(res => JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]))
  .then(json => json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges)
  .then(json => json.map(({node}) => {
    const src = node.display_url;
    const tags = node.edge_media_to_caption.edges.map(({node}) => node.text);
    var i = 1;
    if(tags.length > 0 && tags[0].indexOf('@') == 0) {
      const tag = tags[0].replace('@', '').split(' ')[0];
      const link = 'https://www.instagram.com/' + tag;
      const text = tag.length < 12 ? tag : tag.substring(0, 9) + '...';
      return {src, link, text};
    }
    return {src};
  }));
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

