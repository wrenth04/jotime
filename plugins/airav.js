const {$, debug, ssl} = require('./utils');

const filter = 'airav.cc';
module.exports = {filter, action};

function action(uri) { 
  uri = uri.replace('playon', 'EmbeddedVideo').replace('m.', '');
  return $(uri)
    .then($ => {
      const uri = $('source[type="video/mp4"]').attr('src');
      const img = $('meta[property="og:image"]').attr('content') || $('video').attr('poster');
      return {
        "type": "video",
        "originalContentUrl": uri,
        "previewImageUrl": ssl(img)
      };
    });
}

