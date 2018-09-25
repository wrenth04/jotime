const {$, imgwall, findLinks} = require('./utils');

const hotkeys = {
  'jstudy': 'https://softnshare.com/category/freecourse/'
};
const filter = 'softnshare.com';
module.exports = {filter, action, hotkeys};

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
