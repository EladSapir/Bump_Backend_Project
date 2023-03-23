import { expect } from 'chai';

// eslint-disable-next-line no-undef
describe('Arrays', () => {
  // eslint-disable-next-line no-undef
  describe('sort', () => {
    // eslint-disable-next-line no-undef
    it('Sort not sorted names array', () => {
      const names = ['Dani', 'Moshe', 'Adam'];
      expect(names.sort()).to.be.eql(['Adam', 'Dani', 'Moshe']);
    });
  });
});
