const {$, debug, imgwall, findLinks, pushMsg, dbInstance} = require('./utils');
const db = dbInstance('softnshare');
const DELAY = 15*60*1000;

const hotkeys = {
  'jstudy': 'https://softnshare.com/category/freecourse/'
};
const filter = 'softnshare.com';
module.exports = {filter, action, hotkeys};

var data;
db.get().then(res => data = res)
  .then(() => {
    daemon();
    setInterval(daemon, DELAY);
  });

function daemon() {
  action(hotkeys['jstudy'])
    .then(msg => {
      const {uri} = msg.template.columns[0].actions[0];
      return isNew(uri) ? pushMsg(data.to, msg) : null;
    });
}

function isNew(uri) {
  const check = data.last != uri;
  if(check) {
    db.put({json: {last: uri}});
    data.last = uri;
  }
  return check;
}

function action(uri) {
  return $(uri)
    .then(findLinks)
    .then(({$, links}) => {
      const article = [];
      $('article').each((i, e) => {
        const $a = $(e);
        article.push({
          title: $($a.find('a').get(0)).text(),
          image: $a.find('img').attr('data-orig-file'),
          link: $a.find('a').attr('href')
        });
      });
      return {article};
    })
    .then(({article}) => ({
      type: 'template',
      altText: 'softnshare free course',
      template: {
        type: 'carousel',
        columns: article.map(a => ({
          thumbnailImageUrl: a.image,
          text: a.title,
          actions: [{
            type: 'uri',
            label: 'go',
            uri: a.link
          }]
        }))
      }
    }));
}


