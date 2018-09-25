const {$, imgwall, debug} = require('./utils');

const hotkeys = {
  'j101': 'https://v.jav101.com',
};
const filter = 'jav101';
module.exports = {filter, action, hotkeys};

function action(uri) {
  return $(uri)
    .then($ => {
      const imgs = [];
      $('.videoBox').each((i, e) => {
        const $e = $(e);
        const isFree = $e.find('.free').length != 0;
        if(!isFree) return;
        const link = 'https://v.jav101.com' + $e.attr('href');
        const text = $e.find('.title').text().substring(0, 12);
        const src = $e.find('.videoBox-cover').attr('data-src');
        imgs.push({isFree, link, text, src});
      });
      return {title: 'jav101 free video', imgs};
    })
    .then(imgwall);
}
