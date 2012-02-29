(function() {

  describe('ScrollSection object constrution', function() {
    var section;
    section = void 0;
    beforeEach(function() {
      section = new ScrollSection(sandbox());
    });
    it('matches an instance of ScrollSection', function() {
      expect(section).toEqual(jasmine.any(ScrollSection));
      expect(section).not.toBeNull();
    });
    it('should expose related dom element wrapped in a jquery object', function() {
      var $elm;
      $elm = sandbox();
      section = new ScrollSection($elm);
      expect(section.$container).toEqual(jasmine.any(jQuery));
      expect(section.$container.get(0)).toEqual($elm.get(0));
    });
    return it('should load scroll length from dom element data attribute', function() {
      var $elm;
      $elm = sandbox({
        "data-scroll": 123
      });
      section = new ScrollSection($elm);
      expect(section.scroll()).toEqual(123);
    });
  });

  describe('Update scroll status', function() {
    var section;
    section = void 0;
    beforeEach(function() {
      var $elm;
      $elm = sandbox();
      $elm.appendTo('body');
      section = new ScrollSection($elm);
    });
    it('should be able to set and get the height', function() {
      expect(section.height(-1)).toEqual(0);
      expect(section.height(1)).toEqual(1);
      expect(section.height(0)).toEqual(0);
    });
    it('should be able to set and get the scroll length', function() {
      expect(section.scroll(-1)).toEqual(0);
      expect(section.scroll(1)).toEqual(1);
      expect(section.scroll(0)).toEqual(0);
    });
    it('should be able to set and get the top position', function() {
      expect(section.top(-1)).toEqual(-1);
      expect(section.top(0)).toEqual(0);
      expect(section.top(1)).toEqual(1);
    });
    it('should be able to set and the current transition', function() {
      expect(section.transition(-1)).toEqual(0);
      expect(section.transition(0)).toEqual(0);
      expect(section.transition(0.5)).toEqual(0.5);
      expect(section.transition(1)).toEqual(1);
      expect(section.transition(2)).toEqual(1);
    });
    return it('should be able to pass dist to top set transition progress', function() {
      var i, _results;
      section = new ScrollSection(sandbox({
        "data-scroll": "50",
        "style": "width:100px; height:100px;"
      }));
      _results = [];
      for (i = 0; i <= 50; i++) {
        section.top(0, i);
        _results.push(expect(section.transition().toFixed(4)).toEqual((0.02 * i).toFixed(4)));
      }
      return _results;
    });
  });

}).call(this);
