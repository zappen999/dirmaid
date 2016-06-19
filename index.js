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
    this._intervalTimer = null;

    // Events
    this._evts = {
      check: () => {},
      error: (err) => {},
    };

    // Validate options object
    this._validateOptions();
  }

  /**
   * Validates the options object
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @throws Error  If some of the object values is invalid
   * @return {void}
   */
  _validateOptions() {
    // TODO: Validate options object
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

  /**
   * Get files from the set path
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Function} cb Callback function
   * @return {void}
   */
  _getFiles(cb) {
    glob(this._files, {realpath: true}, (err, files) => {
      if (err) {
        return cb(err);
      }

      return cb(null, files);
    });
  }

  /**
   * Runs fs.stat and appends the file information
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Array}    files Array with filenames
   * @param  {Function} cb    Callback function
   * @return {void}
   */
  _fillStatInfo(files, cb) {
    async.map(files, fs.stat, (err, stats) => {
      if (err) {
        return cb(err);
      }

      // Append the realpath to the stat information
      const f = stats.map((stat, i) => {
        stat.realpath = files[i];
        return stat;
      });

      return cb(null, f);
    });
  }

  /**
   * Filters out files that are too new
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Array} Array with files
   * @return {Array} Array with old files
   */
  _filterNew(files) {
    return files.filter(file => {
      return this._isOld(file.ctime, this._opt.age);
    });
  }

  /**
   * Determines if a file is old depending on max age
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Date}     date   Date to check
   * @param  {string}  maxAge String representation of time that ´ms´ can parse
   * @param  {Date}    ref    Date as reference, defaults to now
   * @return {Boolean}       True if old, false if not
   */
  _isOld(date, maxAge, ref = new Date()) {
    return date.getTime() + ms(maxAge) < ref.getTime();
  }

  /**
   * Worker function wraps up all helper functions to a single job.
   * 1. Load files
   * 2. Get information of files (fs.stat)
   * 3. Filter out files thats too new
   * 4. Remove old files
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Boolean} test Test mode or not, test mode will not remove files
   * @return {void}
   */
  _worker(test = false) {
    async.waterfall([
      // Get the files from the specified path
      (callback) => {
        this._getFiles((err, files) => {
          if (err) {
            return callback(err);
          }

          return callback(null, files);
        });
      },
      // Run `stat` on all files
      (files, callback) => {
        this._fillStatInfo(files, (err, files) => {
          if (err) {
            return callback(err);
          }

          return callback(null, files);
        });
      },
      // Remove files that are too new from the list
      (files, callback) => {
        return callback(null, this._filterNew(files));
      },
      // Old files end up here
      (files, callback) => {
        if (test === true) {
          return callback(null, files);
        }

        // Delete files async
        for (const file of files) {
          fs.unlink(file.realpath);
        }

        return callback(null, files);
      }
    ], (err, files) => { // Handle any errors
      if (err) {
        return this._evts.error(err);
      }

      this._evts.check(files);
    });
  }

  /**
   * Runs the worker with the set interval
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @param  {Boolean} testMode Testmode on/off
   * @return {void}
   */
  run(testMode = false) {
    this._intervalTimer = setInterval(() => {
      this._worker(testMode);
    }, ms(this._opt.interval));
  }

  /**
   * Stops the worker
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {void}
   */
  stop() {
    clearInterval(this._intervalTimer);
  }

  /**
   * Runs the worker in test mode. This will not delete any files
   * @author Johan Kanefur <johan.canefur@gmail.com>
   * @return {void}
   */
  test() {
    // Run worker as test
    this.run(true);
  }
}

module.exports = Dirmaid;
