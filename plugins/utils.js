const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {imgwall, findLinks, $, debug, ssl};

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
      links.push({type: 'ig', link: link});

    if(link.indexOf('twitter.com') != -1)
      links.push({type: 'twitter', link});
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
    cols.push({
      "imageUrl": imgs[i].src || imgs[i],
      "action": {
        "type": "uri",
        label,
        "uri": imgs[i].link || title
      }
    });
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