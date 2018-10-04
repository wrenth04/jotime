const {$, debug} = require('./utils');

const filter = 'airav.cc';
module.exports = {filter, action};

function action(uri) { 
  return $(uri)
    .then($ => {
      const uri = $('source[type="video/mp4"]').attr('src');
      const img = $('meta[property="og:image"]').attr('content');
      return {
        "type": "video",
        "originalContentUrl": uri,
        "previewImageUrl": img
      };
    });
}

