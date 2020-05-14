const {pushMsg, dbInstance, viewMore, $, imgwall, findLinks} = require('./utils');
const db = dbInstance('eats');
const DELAY = 15*60*1000;

const filter = '吃什麼';
module.exports = {filter, action};

var restaurant = [];

updateRestaurant();
setInterval(updateRestaurant, DELAY);
function updateRestaurant() {
  db.get('restaurant').then(data => restaurant = data || restaurant);
  console.log(restaurant);
}

function action(uri) {
  return new Promise(reslove => {
    reslove({
      type: 'template',
      altText: '吃什麼',
      template: {
        type: 'carousel',
        columns: restaurant.shuffle().slice(0, 10).map(({title, map, img}) => ({
          text: title,
          thumbnailImageUrl: img,
          actions: [{
            type: 'uri',
            label: 'map',
            uri: map
          }, {
            type: 'message',
            label: `${title}+1`,
            text:`${title}+1` 
          }]
        }))
      }
    });
  });
}

/*
{
      type: 'template',
      altText: '17media top 10',
      template: {
        type: 'carousel',
        columns: data.map(({name, bio, website, cover, rtmp, room, profile, roomID}) => ({
          text: name,
          thumbnailImageUrl: cover,
          actions: [{
            type: 'uri',
            label: `room(${roomID})`,
            uri: room
          }, {
            type: 'uri',
            label: 'live stream',
            uri: rtmp 
          }, websiteBtn({website, room, profile})
          ]
        }))
      }
    }
*/
