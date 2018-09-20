
module.exports = {imgwall, findIg};

function findIg($) {
  const igs = [];
  $('a').each((i, e) => {
    const href = $(e).attr('href') || '';
    if(href.indexOf('instagram.com') == -1 || href.indexOf('/p/') != -1) return;
    igs.push(href);
  });
  return {$, igs};
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
    igs: ['ig link']
  }
*/
function imgwall({imgs=[], title="", igs=[]}) {
  if(igs.length > 0) {
    imgs[0].text = 'ig';
    imgs[0].link = igs[0];
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
