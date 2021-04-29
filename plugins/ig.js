const axios = require('axios');
const md5 = require('md5');
const cheerio = require('cheerio');
const exec = require('child_process').exec;
const Chromeless = require('chromeless').Chromeless;
const launchChrome = true;
const {imgwall, debug, $} = require('./utils');

var chrome = new Chromeless({launchChrome}) 
  .setUserAgent('Mozilla/5.0 (Linux; Android 10; SM-M115F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36');

const QUERY_HASH = '42323d64886122307be10013ad2dcc44';
const HTTP_OPTS = {headers:{'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'}};

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
  uri = uri.replace('/reel/', '/p/');
  return (uri.indexOf('/p/') == -1 ? home(uri) : post(uri));
}

function photoold(uri) {
  return axios.get(uri)
    .then(res => cheerio.load(res.data))
    .then($ => $('meta[property="og:image"]').attr('content'))
    .then(img => [{src: img}]);
}

function post(uri) {
  const postid = uri.split('/')[4];
  console.log('postid:'+postid);
  return $('https://www.pixwox.com/zh-hant/post/'+postid, HTTP_OPTS)
    .then($ => {
      const video = $('meta[property="og:video"]').attr('content');
      const type = !video ? 'photo' : 'video';
      switch(type){
        case 'video':
          const img = $('meta[property="og:image"]').attr('content');
          return {
            "type": "video",
            "originalContentUrl": video,
            "previewImageUrl": img
	  };
        case 'photo':
          const imgs = [];
          $('.pic a').each((i, e) => imgs.push({src: $(e).attr('href')}));
          return imgwall({title: uri, imgs});
      }
    }).then(debug);
  }

function post20210423(uri) {
  return chrome.goto(uri).wait(5*1000).html()
    .then(res => {
      const json = JSON.parse(res.split('graphql":')[1].split('});</script>')[0]);
      const $ = cheerio.load(res);
      const type = res.indexOf('is_video":true') != -1 ? 'video' : 'photo';
      switch(type){
        case 'video': return video(json);
        case 'photo': return imgwall({title: uri, imgs:photo(json)});
      }
    });
}

function photo(json){
  const {shortcode_media} = json;
  if(shortcode_media.edge_sidecar_to_children)
    return shortcode_media.edge_sidecar_to_children.edges.map(({node}) => ({src: node.display_url}));
  else
    return [{src: shortcode_media.display_url}];
}

function video(json) {
  const {shortcode_media} = json.entry_data.PostPage[0].graphql;
  const img = shortcode_media.display_url;
  const uri = shortcode_media.video_url;
  return {
    "type": "video",
    "originalContentUrl": uri,
    "previewImageUrl": img
  };
}

function home(uri) {
  const username=uri.split('/')[3].split('?')[0];
  return $('https://www.pixwox.com/zh-hant/profile/'+username, HTTP_OPTS)
  .then($ => {
    const imgs = [];
    $('.item').each((i, e) => {
      const src = $(e).find('.preview img').first().attr('data-src');
      if(!src || src == '') return;
      imgs.push({src});
    });
    return imgs;
  })
  .then(imgs => imgwall({title: uri, imgs}));
}

function homechrome(uri) {
  const username=uri.split('/')[3].split('?')[0];
  //exec(`sudo docker exec -ti 7fb bash -c 'cd /disk/sf_g/webdata/17media/mirror/ig && ./adduser.sh ${username}'`);
  //console.log(`download ig ${username}`);
  return chrome.goto(uri)
  .wait(5*1000)
  .html()
  .then(html => JSON.parse(html.split('_sharedData =')[1].split(';</script>')[0]))
  .then(json => {
    const username =json.entry_data.ProfilePage[0].graphql.user.username;
    return json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
  })
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

function home2(uri) {
  const username=uri.split('/')[3].split('?')[0];
  //exec(`sudo docker exec -ti 7fb bash -c 'cd /disk/sf_g/webdata/17media/mirror/ig && ./adduser.sh ${username}'`);
  //console.log(`download ig ${username}`);
  return axios.get(uri)
  .then(res => JSON.parse(res.data.split('_sharedData =')[1].split(';</script>')[0]))
  .then(debug)
  .then(json => {
    const username =json.entry_data.ProfilePage[0].graphql.user.username;
    return json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
  })
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

