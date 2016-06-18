/**
 * Maid module
 */
const fs = require('fs');
const glob = require('glob');
const async = require('async');
const ms = require('ms');

class Dirmaid {
  /**
   * Constructor
   * Example options object
   * {
   *   interval: '60s',   // How often to check
   *   age: '1d',         // How old files must be before deletion
   * }
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string} files File match to clean
   * @param  {object} opt   Options object
   * @return {Maid}         Self
   */
  constructor(files, opt) {
    this._files = files;
    this._opt = opt;
    this._stats = null;

    // Events
    this._evts = {
      check: () => {
        console.log('Default check event');
      },
      error: (err) => {
        console.log('Default error event', err);
      },
    };
  }

  /**
   * Loads the specified directory
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Function} cb  Callback function
   * @return {void}
   */
  _loadDir(cb) {

  }

  /**
   * Validates the options object
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @throws Error  If some of the object values is invalid
   * @return {void}
   */
  _validateOptions() {

  }

  /**
   * Register event listeners
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {string}   eventName Name of the event
   * @param  {Function} cb        Callback function
   * @return {Dirmaid}            Self
   */
  on(eventName, cb) {
    const valid = ['check', 'error'];

    if (valid.indexOf(eventName) === -1) {
      throw new Error('Invalid event name');
    }

    this._evts[eventName] = cb;

    return this;
  }

  _worker() {
    glob(this._files, (err, files) => {
      if (err) {
        return this._evts.error(err);
      }

      async.map(files, fs.stat, (err, results) => {
        if (err) {
          return this._evts.error(err);
        }

        console.log(files);
        console.log(results);
      });
    });
  }

  run() {
    this._worker();
  }
}

module.exports = Dirmaid;
