const {pushMsg} = require('./utils');
const axios = require('axios');
const DELAY = 15*60*1000;

const filter = 'coin-binance';
module.exports = {filter, action};

binanceDaemon();
setInterval(binanceDaemon, DELAY);

function binanceDaemon() {
  axios.get('https://www.binance.com/fapi/v1/premiumIndex').then(res => {
      const json = res.data.map(a => {
          a.lastFundingRate = parseFloat(a.lastFundingRate) * 100;
          return a;
        }).sort((a , b) => b.lastFundingRate - a.lastFundingRate);
      const max = parseFloat(json[0].lastFundingRate);
      const min = parseFloat(json[json.length-1].lastFundingRate);
      if(max < 0.4 && min > -0.4) return;
      pushMsg('Ref7907183e5b361f2447c28585f03333', {
        type: 'text',
        text: `max: ${max}%, min: ${min}%, https://www.binance.com/zh-TW/futures/funding-history/0`
      });
    });
}

function action(uri) {
  return null;
}
