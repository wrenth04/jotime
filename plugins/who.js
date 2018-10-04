const {debug} = require('./utils');
const goo = require('./google');

const filter = '是誰';
module.exports = {filter, action};

function action(msg) {
  const name = msg.split('是誰')[0] || null;
  if(!name) return;
  return goo.action('goo-'+name);
}
