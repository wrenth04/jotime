const {$, debug} = require('./utils');

const hotkeys = {
  'jtube': 'https://www.youtube.com/channel/UCr4ZqhqR6cGVSpxN59gLaZQ',
  '狂新聞': 'https://www.youtube.com/channel/UCVF3bTd3dxM4IfOMFCbNADA',
  '電獺少女': 'https://www.youtube.com/channel/UCAr4MVsPBKjhg5eLDDpbDFg'
};
const filter = 'youtube.com/channel';
module.exports = {filter, action, hotkeys};

function action(uri) {
  if(uri.indexOf('channel') != -1 && uri.indexOf('/videos') == -1)
    uri = uri.replace(/\/$/,  '') + '/videos';
  return $(uri)
    .then($ => {
      const title = $('meta[property="og:title"]').attr('content');
      const videos =[];
      $('a[title]').each((i, e) => {
        if(videos.length >= 10) return;
        const $e = $(e);
        const vid = $e.attr('href').split('v=')[1];
        if(!vid) return;
        videos.push({
          title: $e.attr('title').substring(0, 50), 
          image: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`, 
          link: `https://www.youtube.com/watch?v=${vid}`
        });
      });
      return {title, videos};
    })
    .then(({title, videos}) => ({
      type: 'template',
      altText: title || 'youtube videos',
      template: {
        type: 'carousel',
        columns: videos.map(a => ({
          thumbnailImageUrl: a.image,
          text: a.title,
          actions: [{
            type: 'uri',
            label: 'youtube',
            uri: a.link
          }, {
            type: 'message',
            label: 'line',
            text: a.link
          }]
        }))
      }
    }));
}


