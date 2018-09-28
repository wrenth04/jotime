const axios = require('axios');
const cheerio = require('cheerio');
const {dbHost, channelAccessToken} = require('../config');

module.exports = {viewMore, imgwall, findLinks, $, debug, ssl, pushMsg, dbInstance};

function viewMore(uri) {
  return (data) => {
    const {imgs} = data;
    if(!imgs) return data;
    const last = imgs[Math.min(imgs.length - 1, 9)];
    last.text = 'view more';
    last.link = uri;
    return data;
  };
}

function dbInstance(tag) {
  if(!tag) return null;
  const host = `${dbHost}plugins/${tag}`;
  return {
    put: ({path='', json={}}) => axios.patch(`${host}/${path}.json`, json),
    get: (path='') => axios.get(`${host}/${path}.json`).then(res => res.data)
  };
}

function pushMsg(to, msg) {
  if(!to || !msg) return;
  const json = {
    to,
    messages: [msg]
  };
  return axios.post('https://api.line.me/v2/bot/message/push', json, {headers: {Authorization: `Bearer ${channelAccessToken}`}}).then(res => res.data);
}

function ssl(url = '') {
  return 'https://ssl-proxy.my-addr.org/myaddrproxy.php/' + url.replace(':/', '');
}

function debug(data) {
  console.log(JSON.stringify(data, null, 2));
  return data;
}

function $(uri) {
  return axios.get(uri).then(res => cheerio.load(res.data));
}

function findLinks($) {
  const links = [];
  $('a').each((i, e) => {
    const link = $(e).attr('href') || '';

    if(link.indexOf('instagram.com') != -1 && link.indexOf('/p/') == -1)
      links.push({type: 'instagram', link: link});

    if(link.indexOf('twitter.com') != -1)
      links.push({type: 'twitter', link});

    if(link.indexOf('facebook.com') != -1)
      links.push({type: 'facebook', link});
  });
  return {$, links};
}

/*
  input: 
  {
    title: 'title text',
    imgs: [{
      text: 'img label max 12 char',
      src: 'img url max to 1024x1024',
      link: 'img link'
    }],
    links: [{
      type: 'link site',
      link: 'link',
    }]
  }
*/
function imgwall({imgs=[], title="", links=[]}) {
  for(var i = 0; i < Math.min(imgs.length, links.length); i++) {
    imgs[i].text = links[i].type;
    imgs[i].link = links[i].link;
  }

  const cols = [];

  for(var i = 0 ; i < Math.min(10, imgs.length); i++) {
    const label = imgs[i].text;
    const type = imgs[i].type;
    if(['instagram'].indexOf(label) != -1 || ['instagram'].indexOf(type) != -1) {
      cols.push({
        "imageUrl": imgs[i].src || imgs[i],
        "action": {
          "type": "message",
          label,
          "text": imgs[i].link || title
        }
      });
    } else {
      cols.push({
        "imageUrl": imgs[i].src || imgs[i],
        "action": {
          "type": "uri",
          label,
          "uri": imgs[i].link || title
        }
      });
    }
  }
  return {
    "type": "template",
    "altText": title,
    "template": {
        "type": "image_carousel",
        "columns": cols
    }
  };
}
