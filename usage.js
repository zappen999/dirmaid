const Dirmaid = require('./');

const maid = new Dirmaid('*.js', {
  interval: '5s',
  age: '1h'
});

maid.on('error', err => {
  console.log('Maid err', err);
});

maid.run();
