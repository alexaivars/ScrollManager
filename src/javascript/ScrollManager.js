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
    "use strict";    var k, len, n, t;
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
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement) {
    "use strict";    var k, len, n, t;
    if (typeof this === "undefined" || this === null) {
      throw new TypeError();
    }
    t = Object(this);
    len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) {
        n = 0;
      } else {
        if (n !== 0 && n !== Infinity && n !== -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
    }
    if (n >= len) {
      return -1;
    }
    k = (n >= 0 ? n : Math.max(len - Math.abs(n), 0));
    while (k < len) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
      k++;
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
      if (o !== void 0) {
        this.transition(o / this.scroll());
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
  ScrollManager.ALIGN_CENTER = "center";
  ScrollManager.ALIGN_TOP = "top";
  ScrollManager.WINDOW_HEIGHT = -1;
  ScrollManager.prototype.scrollTable = void 0;
  ScrollManager.prototype.scrollValue = void 0;
  ScrollManager.prototype.options = void 0;
  function ScrollManager(options) {
    var index, _blocks, _container, _dist;
    this.options = {
      align: ScrollManager.ALIGN_TOP,
      debug: false
    };
    for (index in this.options) {
      if (options && typeof options[index] !== "undefined") {
        this.options[index] = options[index];
      }
    }
    ScrollManager.WINDOW_HEIGHT = $(window).height();
    _container = void 0;
    this.container = function() {
      if (_container === void 0) {
        _container = $("<div class='scroll-manager'></div>");
        _container.css({
          height: ScrollManager.WINDOW_HEIGHT
        });
        _container.appendTo($('body'));
      }
      return _container;
    };
    _blocks = [];
    this.blocks = function(block) {
      if (block && block instanceof ScrollBlock) {
        _blocks.push(block);
        block.$container.appendTo(this.container());
        return this.setHeight();
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
    $(window).scroll(__bind(function(event) {
      return this.onWindowScroll(event);
    }, this));
    $(window).resize(__bind(function(event) {
      return this.onWindowResize(event);
    }, this));
    $(window).resize();
  };
  ScrollManager.prototype.setHeight = function() {
    var block, _height, _i, _len, _ref2;
    _height = 0;
    _ref2 = this.blocks();
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      block = _ref2[_i];
      _height += block.height() + block.scroll();
    }
    if (this.blocks()[this.blocks().length - 1]) {
      _height -= this.blocks()[this.blocks().length - 1].height();
    }
    _height += ScrollManager.WINDOW_HEIGHT;
    return this.container().height(_height);
  };
  ScrollManager.prototype.rebuildScrollTable = function() {
    var block, f, h, i, s, y, _i, _j, _len, _len2, _ref2, _ref3;
    if (this.options.align === ScrollManager.ALIGN_CENTER) {
      this.scrollTable = [];
      y = Math.round(ScrollManager.WINDOW_HEIGHT * 0.5);
      f = true;
      _ref2 = this.blocks();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        block = _ref2[_i];
        s = block.scroll();
        h = block.height() * 0.5;
        if (f !== true) {
          for (i = 1; 1 <= h ? i <= h : i >= h; 1 <= h ? i++ : i--) {
            this.scrollTable.push(y - i + 1);
          }
        }
        for (i = 1; 1 <= s ? i <= s : i >= s; 1 <= s ? i++ : i--) {
          this.scrollTable.push(y - h);
        }
        for (i = 1; 1 <= h ? i <= h : i >= h; 1 <= h ? i++ : i--) {
          this.scrollTable.push(y - i + 1 - h);
        }
        y -= h * 2;
        f = false;
      }
    } else {
      this.scrollTable = [];
      y = 0;
      _ref3 = this.blocks();
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        block = _ref3[_j];
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
    }
  };
  ScrollManager.prototype.render = function() {
    var block, c, y, _i, _j, _len, _len2, _ref2, _ref3;
    y = this.scrollValue;
    c = Math.round(ScrollManager.WINDOW_HEIGHT * 0.5);
    if (this.options.align === ScrollManager.ALIGN_CENTER) {
      _ref2 = this.blocks();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        block = _ref2[_i];
        if (y < c - block.height() * 0.5) {
          block.top(y, block.scroll());
        } else if (y === c - block.height() * 0.5) {
          block.top(y, this.pageDist());
        } else {
          block.top(y, 0);
        }
        y += block.height();
      }
    } else {
      _ref3 = this.blocks();
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        block = _ref3[_j];
        if (y < 0) {
          block.top(y, block.scroll());
        } else if (y === 0) {
          block.top(y, this.pageDist());
        } else {
          block.top(y, 0);
        }
        y += block.height();
      }
    }
  };
  ScrollManager.prototype.pageScroll = function(y) {
    var x;
    if (y === void 0) {
      y = $(window).scrollTop();
    }
    y = Math.max(0, y);
    if (y < 0 || y > this.scrollTable.length) {
      this.scrollValue = -y;
    } else {
      x = this.scrollTable[y];
      this.scrollValue = x;
    }
    this.pageDist(y);
    this.render();
  };
  ScrollManager.prototype.onWindowScroll = function() {
    this.pageScroll($(window).scrollTop());
  };
  ScrollManager.prototype.onWindowResize = function() {
    ScrollManager.WINDOW_HEIGHT = $(window).height();
    this.container().width($(window).width());
    this.setHeight();
    this.rebuildScrollTable();
    this.pageScroll($(window).scrollTop());
  };
  ScrollManager.prototype.onActivated = function(e) {};
  return ScrollManager;
})();