(function() {
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
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement) {
      "use strict";      var k, len, n, t;
      if (typeof this === "undefined" || this === null) {
        throw new TypeError();
      }
      t = Object(this);
      len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      n = len;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else {
          if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }
      }
      k = (n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n));
      while (k >= 0) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
        k--;
      }
      return -1;
    };
  }
  ScrollBlock = (function() {
    ScrollBlock.prototype.$container = null;
    function ScrollBlock(elm) {
      this.$container = elm instanceof jQuery ? elm : $(elm);
      this.init();
      return;
    }
    ScrollBlock.prototype.init = function() {
      var _scroll, _transition;
      this.$container.css({
        position: "fixed",
        display: "block",
        width: this.$container.width(),
        height: this.$container.height()
      });
      _scroll = this.$container.data("scroll");
      this.scroll = function(value) {
        if (value !== void 0) {
          _scroll = Math.max(0, value);
        }
        return _scroll;
      };
      _transition = 0;
      this.transition = function(value) {
        if (value !== void 0) {
          _transition = Math.min(1, Math.max(0, value));
          this.$container.html(_transition);
        }
        return _transition;
      };
    };
    ScrollBlock.prototype.top = function(y, o) {
      if (y !== void 0) {
        this.$container.css({
          top: y
        });
        if (o !== void 0 && y === 0) {
          this.transition(o / this.scroll());
        } else if (y < 0) {
          this.transition(1);
        } else {
          this.transition(0);
        }
      }
      return this.$container.position().top;
    };
    ScrollBlock.prototype.height = function(height) {
      if (height !== void 0) {
        this.$container.css({
          height: Math.max(0, height)
        });
      }
      return this.$container.height();
    };
    ScrollBlock.prototype.active = function(x) {
      return this.activated.dispatch(this);
    };
    return ScrollBlock;
  })();
  ScrollManager = (function() {
    ScrollManager.prototype.scrollTable = [];
    ScrollManager.prototype.scrollValue = 0;
    function ScrollManager() {
      var _blocks, _dist;
      _blocks = [];
      this.blocks = function(block) {
        if (block && block instanceof ScrollBlock) {
          return _blocks.push(block);
        } else if (block) {
          throw new TypeError("expected ScrollBlock object");
        } else {
          return _blocks;
        }
      };
      _dist = void 0;
      this.pageDist = function(y) {
        var a, b, x;
        if (y !== void 0) {
          x = this.scrollTable[y];
          a = this.scrollTable.indexOf(x);
          b = this.scrollTable.lastIndexOf(x);
          if (a !== b) {
            _dist = y - a;
          } else {
            _dist = void 0;
          }
        }
        return _dist;
      };
    }
    ScrollManager.prototype.init = function() {
      var block, _i, _len, _ref2;
      _ref2 = $('#main').find(".scroll-block");
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        block = _ref2[_i];
        this.blocks(new ScrollBlock(block));
      }
      this.rebuildScrollTable();
      this.blockScroll(0);
      $(window).scroll(__bind(function(event) {
        return this.onWindowScroll(event);
      }, this));
    };
    ScrollManager.prototype.rebuildScrollTable = function() {
      var block, h, i, s, y, _i, _len, _ref2;
      this.scrollTable = [];
      y = 0;
      _ref2 = this.blocks();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        block = _ref2[_i];
        s = block.scroll();
        h = block.height();
        for (i = 1; 1 <= s ? i <= s : i >= s; 1 <= s ? i++ : i--) {
          this.scrollTable.push(y);
        }
        for (i = 1; 1 <= h ? i <= h : i >= h; 1 <= h ? i++ : i--) {
          this.scrollTable.push(y - i + 1);
        }
        y -= h;
      }
    };
    ScrollManager.prototype.render = function() {
      var block, y, _i, _len, _ref2;
      y = this.blockScroll();
      _ref2 = this.blocks();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        block = _ref2[_i];
        block.top(y, this.pageDist());
        y += block.height();
      }
    };
    ScrollManager.prototype.blockScroll = function(y) {
      if (y !== void 0) {
        this.scrollValue = y;
        this.render();
      }
      return this.scrollValue;
    };
    ScrollManager.prototype.pageScroll = function(y) {
      var x;
      if (y === void 0) {
        y = $(window).scrollTop();
      }
      if (y < 0 || y > this.scrollTable.length) {
        this.blockScroll(-y);
      } else {
        x = this.scrollTable[y];
        this.pageDist(y);
        this.blockScroll(x);
      }
    };
    ScrollManager.prototype.onWindowScroll = function() {
      this.pageScroll($(window).scrollTop());
    };
    ScrollManager.prototype.onActivated = function(e) {};
    return ScrollManager;
  })();
  $(document).ready(function() {
    var manager;
    console.log("٩(×̯×)۶ we are kramgo ٩(×̯×)۶");
    manager = new ScrollManager;
    manager.init();
  });
}).call(this);
