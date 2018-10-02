const {$, imgwall, debug} = require('./utils');

const hotkeys = {
  'candice': 'https://zh-tw.facebook.com/candice0723/'
}
const filter = 'facebook';
module.exports = {filter, action, hotkeys};

function action(uri) {
  return $(uri)
    .then($ => {
      const type = $('meta[property="og:type"]').attr('content');
      switch(type) {
        case 'video': return video($);
        case undefined: return fansPage($);
        default: return null;
      }
    });
}

function fansPage($) {
  const imgs = [];
  $('img').each((i, e) => {
    const $e = $(e);
    const src = $e.attr('src') || null;
    if(!src || src.indexOf('fbcdn') == -1) return;
    var size = src.match(/\d+x\d+/);
    if(!size) return;
    size = size[0].split('x');
    const px = Math.min(parseInt(size[0]), parseInt(size[1]));
    if(px < 200) return;
    const link1 = $e.parent().parent().attr('href');
    const link2 = $e.parent().parent().parent().attr('href');
    const link = link1 || link2;
    if(!link) return;
    imgs.push({src, link: 'https://www.facebook.com'+link});
  });
  const title = $('meta[property="og:title"]').attr('content');
  return imgwall({imgs, title});
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

