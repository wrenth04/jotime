const j101 = require('./j101');

const filter = 'jav101-';
module.exports = {filter, action};

function action(msg) {
  const keyword = encodeURIComponent(msg.split('-')[1]);
  const uri = `https://v.jav101.com/search/${keyword}`;
  return j101.action(uri);
}
