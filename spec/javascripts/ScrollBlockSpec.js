(function() {

  describe('ScrollBlock object constrution', function() {
    var block;
    block = void 0;
    beforeEach(function() {
      block = new ScrollBlock(sandbox());
    });
    it('matches an instance of ScrollBlock', function() {
      expect(block).toEqual(jasmine.any(ScrollBlock));
      expect(block).not.toBeNull();
    });
    it('should expose related dom element wrapped in a jquery object', function() {
      var $elm;
      $elm = sandbox();
      block = new ScrollBlock($elm);
      expect(block.$container).toEqual(jasmine.any(jQuery));
      expect(block.$container.get(0)).toEqual($elm.get(0));
    });
    return it('should load scroll length from dom element data attribute', function() {
      var $elm;
      $elm = sandbox({
        "data-scroll": 123
      });
      block = new ScrollBlock($elm);
      expect(block.scroll()).toEqual(123);
    });
  });

  describe('Update scroll status', function() {
    var block;
    block = void 0;
    beforeEach(function() {
      var $elm;
      $elm = sandbox();
      $elm.appendTo('body');
      block = new ScrollBlock($elm);
    });
    it('should be able to set and get the height', function() {
      expect(block.height(-1)).toEqual(0);
      expect(block.height(1)).toEqual(1);
      expect(block.height(0)).toEqual(0);
    });
    it('should be able to set and get the scroll length', function() {
      expect(block.scroll(-1)).toEqual(0);
      expect(block.scroll(1)).toEqual(1);
      expect(block.scroll(0)).toEqual(0);
    });
    it('should be able to set and get the top position', function() {
      expect(block.top(-1)).toEqual(-1);
      expect(block.top(0)).toEqual(0);
      expect(block.top(1)).toEqual(1);
    });
    it('should be able to set and the current transition', function() {
      expect(block.transition(-1)).toEqual(0);
      expect(block.transition(0)).toEqual(0);
      expect(block.transition(0.5)).toEqual(0.5);
      expect(block.transition(1)).toEqual(1);
      expect(block.transition(2)).toEqual(1);
    });
    return it('should be able to pass dist to top set transition progress', function() {
      var i, _results;
      block = new ScrollBlock(sandbox({
        "data-scroll": "50",
        "style": "width:100px; height:100px;"
      }));
      _results = [];
      for (i = 0; i <= 50; i++) {
        block.top(0, i);
        _results.push(expect(block.transition().toFixed(4)).toEqual((0.02 * i).toFixed(4)));
      }
      return _results;
    });
  });

}).call(this);
