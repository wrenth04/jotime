const {debug} = require('./utils');
const jkf = require('./jkf');

const filter = 'jkf-';
module.exports = {filter, action};

function action(msg) {
  const keyword = encodeURIComponent(msg.split('-')[1]);
  const uri = `https://www.jkforum.net/search.php?mod=forum&searchid=10136&orderby=lastpost&ascdesc=desc&searchsubmit=yes&kw=${keyword}`;
  return jkf.action(uri);
}
