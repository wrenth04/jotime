const {pushMsg, dbInstance, viewMore, $, imgwall, findLinks} = require('./utils');
const db = dbInstance('ptt');
const DELAY = 15*60*1000;

const filter = 'www.ptt.cc/bbs';
module.exports = {filter, action};

var steam = {};
db.get('steam')
  .then(data => steam = data || steam)
  .then(() => {
    steamDaemon();
    setInterval(steamDaemon, DELAY);
  });

function steamDaemon() {
  $('https://www.ptt.cc/bbs/Steam/index.html')
    .then($ => {
      const links = [];
      $('.title a').each((i, e) => {
        const $e = $(e);
        const title = $e.text() || '';
        if(title.indexOf('[限免]') == -1) return;
        links.push($e.attr('href'));
      });
      if(links.length == 0) return;
      const last = links.reverse()[0];
      if(steam.last == last) return;
      steam.last = last;
      db.put({path: 'steam', json: {last}});
      pushMsg(steam.to, {
        type: 'text',
        text: `https://www.ptt.cc${last}`
      });
    });
}

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const title = $('title').text();
      const imgs = [];
      $('#main-content>a').each((i, e) => {
        const href = $(e).attr('href');
        if(href.indexOf('imgur') == -1) return;
        //const id = href.split('/')[3].split('.')[0];
        imgs.push({
          src: href,
          link: href
        });
      });

      return {title, imgs, links};
    })
    .then(viewMore(uri))
    .then(imgwall);
}
