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

  describe('Validate path', () => {
    it('should throw error if the path doesnt exist', () => {
      const m = new Dirmaid('paththatdoesntexist');
    });
  });
});
