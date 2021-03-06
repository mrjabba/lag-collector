const { fetchAppVersion } = require('./fetch_version');

describe('fetchAppVersion', () => {
  it('fetchAppVersion should return git SHA or message on startup', done => {
    function callback (data :any) {
      expect(data).not.toBeNull();
      done();
    }
    fetchAppVersion(callback);
  });
});
