const Dirmaid = require('./index');

// Create a new maid
const maid = new Dirmaid('testdir/*', {
  interval: '10s', // Check every 10 seconds
  age: '20s'       // The files older than 20s will be removed
});

// Listen to for maid errors
maid.on('error', err => {
  console.log('Maid error:', err);
});

// Prints the files that matched and will be removed
maid.on('check', files => {
  console.log('Will remove files:', files.map(file => {
    return file.realpath;
  }));
});

// Run testmode (will not delete any files)
//maid.run();
maid.test();
