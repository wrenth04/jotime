const {viewMore, $, imgwall, debug} = require('./utils');

const hotkeys = {
  'jkf': 'https://www.jkforum.net/forum-736-1.html',
};
const filter = 'jkforum.net';
module.exports = {filter, action, hotkeys};

function action(uri) {
  if(uri.indexOf('thread-') != -1)
    return thread(uri);
  else if(uri.indexOf('search') != -1)
    return search(uri);
  else
    return forum(uri);
}

function search(uri) {
  return $(uri)
    .then($ => {
      const imgs = [];
      $('.pbw').each((i, e) => {
        if(i > 10) return;
        const $e =$(e);
        const src = $e.find('img').attr('src');
        const link = 'https://www.jkforum.net/' + $e.find('a').attr('href');
        const text = $($e.find('a')[1]).text().substring(0, 12);
        imgs.push({src, link, text});
      });
      return {title: 'jkf', imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}

function forum(uri) {
  return $(uri)
    .then($ => {
      const imgs = [];
      $('#waterfall .cl').each((i, e) => {
        if(i > 10) return;
        const $e =$(e);
        const src = $e.find('img').attr('src');
        const link = 'https://www.jkforum.net/' + $e.find('a').attr('href');
        const text = $e.find('img').attr('alt').substring(0, 12);
        imgs.push({src, link, text});
      });
      return {title: 'jkf', imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}

function thread(uri) {
  return $(uri)
    .then($ => {
      const title = $('title').text();
      const imgs = [];
      $('.zoom').each((i, e) => {
        const src = link = $(e).attr('zoomfile');
        if(i > 10) return;
        imgs.push({src, link});
      });
      return {title, imgs};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
