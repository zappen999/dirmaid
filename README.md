# dirmaid
A maid to keep directories clean from old files. Useful for clearing log
directories etc. Follows the ES6 standard.

**DISCLAIMER: I dont take any responsibility for data loss caused by this module.**

```js
maid = new Maid('*.log', {
  interval: '60s',
  age: '2h'
});

maid.run();

```

### Installation
`npm install dirmaid --save`

### Usage

#### File matching
The module uses [glob](https://www.npmjs.com/package/glob) to match files.
Checkout the glob readme for information about file matching.

#### Example

```js
const Dirmaid = require('dirmaid');

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
```

### Tests
Tests can be run with `npm test`
