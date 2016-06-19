const chai = require('chai');
const expect = chai.expect;
const Dirmaid = require('../index');

describe('Dirmaid', function() {
  describe('Constructor', () => {
    it('should set dir and options', () => {
      const opt = {test: 'test'};
      const m = new Dirmaid('testdir/testfile.js', opt);
      expect(m._files).to.equal('testdir/testfile.js');
      expect(m._opt).to.deep.equal(opt);
    });
  });

  describe('Event register', () => {
    it('should append a listener', () => {
      const m = new Dirmaid('testdir/testfile.js', {});
      const l = () => {};
      m.on('check', l);
      expect(m._evts['check'] === l).to.equal(true);
    });

    it('should throw error on invalid listeners', () => {
      const m = new Dirmaid('testdir/testfile.js', {});
      expect(() => m.on('invalidevent', () => {}))
        .to.throw('Invalid event name');

    });

    it('should return self', () => {
      const m = new Dirmaid('testdir/testfile.js', {});
      const l = m.on('check', () => {});
      expect(m === l).to.equal(true);
    });
  });

  describe('Validate options', () => {
    it('should throw error if interval or age is invalid', () => {
      expect(() => new Dirmaid('testdir/testfile.js', {
        interval: 'asd',
        age: '10ms'
      })).to.throw('Invalid');
    });
  });

  describe('Determine if old', () => {
    it('should return true if the date is older than max age', () => {
      const m = new Dirmaid('testdir/testfile.js', {age: '3h'});

      const cdate = new Date('2000-01-01 20:20:20');
      const ref = new Date('2000-01-01 09:20:20');

      expect(m._isOld(cdate, '10h', ref)).to.equal(false);
    });

    it('should return false if the date is newer than max age', () => {
      const m = new Dirmaid('testdir/testfile.js', {age: '3h'});

      const cdate = new Date('2000-01-01 20:20:20');
      const ref = new Date('2000-01-01 19:20:20');

      // In text: cdate can be at most 10hours after the ref
      expect(m._isOld(cdate, '10h', ref)).to.equal(false);
    });
  });
});
