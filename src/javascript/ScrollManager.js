var $, ScrollBlock, ScrollManager, _ref;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$ = jQuery;
if ((_ref = window.console) != null) {
  _ref;
} else {
  window.console = {
    log: function() {}
  };
};
ScrollBlock = (function() {
  ScrollBlock.prototype.$container = null;
  ScrollBlock.prototype.scroll = 0;
  ScrollBlock.prototype.activated = null;
  ScrollBlock.prototype.isScrolling = false;
  function ScrollBlock(elm) {
    this.$container = elm instanceof jQuery ? elm : $(elm);
    this.scroll = this.$container.data("scroll");
    this.activated = new signals.Signal();
    this.init();
    return;
  }
  ScrollBlock.prototype.init = function() {
    var _top;
    this.$container.css({
      position: "fixed",
      width: this.$container.width(),
      height: this.$container.height(),
      top: $(window).height()
    });
    _top = 0;
    this.top = function(value) {
      if (value) {
        _top = value;
      }
      return _top;
    };
  };
  ScrollBlock.prototype.transition = function(value) {
    this.$container.html(value);
  };
  ScrollBlock.prototype.height = function() {
    return this.$container.height();
  };
  ScrollBlock.prototype.active = function(x) {
    this.activated.dispatch(this);
    return this.top() <= x && (this.top() + this.scroll) >= x;
  };
  ScrollBlock.prototype.passed = function(x) {
    return (this.top() + this.scroll) < x;
  };
  ScrollBlock.prototype.scrollTo = function(x, dist) {
    if (dist >= 0 && dist <= this.scroll) {
      this.isScrolling = true;
    } else {
      this.isScrolling = false;
    }
    /*
        if @active(x)
          @transition  (x - @top()) / @scroll
          x = @top()
        else if @passed(x)
          x = x - @scroll
          @transition 1
        else
          @transition 0
    
        @$container.css({
          top:@top() - x
        })
        */
    this.$container.css({
      top: x
    });
  };
  return ScrollBlock;
})();
ScrollManager = (function() {
  ScrollManager.prototype.blocks = [];
  function ScrollManager() {
    $(window).scroll(__bind(function(event) {
      return this.scrolled(event);
    }, this));
    return;
  }
  ScrollManager.prototype.init = function() {
    var block, _i, _len, _ref2;
    _ref2 = $('#main').find(".scroll-block");
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      block = _ref2[_i];
      this.blocks.push(new ScrollBlock(block));
    }
    this.blocks[0].activated.add(__bind(function(target) {
      return this.onActivated();
    }, this));
    this.scrolled();
  };
  ScrollManager.prototype.layout = function() {};
  ScrollManager.prototype.scrolled = function() {
    var block, i, offset, scroll, _len, _ref2;
    scroll = $(window).scrollTop();
    console.log("--------------------");
    offset = 0;
    _ref2 = this.blocks;
    for (i = 0, _len = _ref2.length; i < _len; i++) {
      block = _ref2[i];
      block.scrollTo(-scroll + offset, scroll - offset);
      console.log(i + ":" + block.isScrolling);
      offset += block.height();
    }
  };
  ScrollManager.prototype.onActivated = function(e) {};
  return ScrollManager;
})();