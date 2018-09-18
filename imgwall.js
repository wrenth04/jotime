
/*
  input: 
  {
    title: 'title text',
    imgs: [{
      text: 'img label',
      src: 'img url max to 1024x1024',
      link: 'img link'
    }]
  }
*/
module.exports = ({imgs=[], title=""}) => {
  var cols = [];
  for(var i = 0 ; i < Math.min(10, imgs.length); i++) {
    cols.push({
      "imageUrl": imgs[i].src || imgs[i],
      "action": {
        "type": "uri",
        "label": imgs[i].text || (i+1)+'',
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
