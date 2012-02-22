(function() {
  describe('ScrollManager', function() {
    return describe('ScrollManager object constrution', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        return manager = new ScrollManager();
      });
      return it('matches an instance of ScrollManager', function() {
        expect(manager).toEqual(jasmine.any(ScrollManager));
        return expect(manager).not.toBeNull();
      });
    });
  });
}).call(this);
