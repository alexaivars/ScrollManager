
/*
* TERMS OF USE - SCROLL MANAGER
* 
* Open source under the BSD License. 
* 
* Copyright © 2012 Alexander Aivars
* All rights reserved.
*  
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
*   Redistributions of source code must retain the above copyright notice, this list of 
*   conditions and the following disclaimer.
*
*   Redistributions in binary form must reproduce the above copyright notice, this list 
*   of conditions and the following disclaimer in the documentation and/or other materials 
*   provided with the distribution.
*
*   Neither the name of the author nor the names of contributors may be used to endorse 
*   or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function() {
  var $, BackgroundSection, ScrollManager, ScrollSection,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  if (window.console == null) {
    window.console = {
      log: function() {}
    };
  }

  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement) {
      "use strict";
      var k, len, n, t;
      if (typeof this === "undefined" || this === null) throw new TypeError();
      t = Object(this);
      len = t.length >>> 0;
      if (len === 0) return -1;
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
        if (k in t && t[k] === searchElement) return k;
        k--;
      }
      return -1;
    };
  }

  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      "use strict";
      var k, len, n, t;
      if (typeof this === "undefined" || this === null) throw new TypeError();
      t = Object(this);
      len = t.length >>> 0;
      if (len === 0) return -1;
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
      if (n >= len) return -1;
      k = (n >= 0 ? n : Math.max(len - Math.abs(n), 0));
      while (k < len) {
        if (k in t && t[k] === searchElement) return k;
        k++;
      }
      return -1;
    };
  }

  ScrollSection = (function() {

    ScrollSection.prototype.$container = null;

    function ScrollSection(elm) {
      this.$container = elm instanceof jQuery ? elm : $(elm);
      this.init();
      return;
    }

    ScrollSection.prototype.init = function() {
      var _scroll, _transition;
      this.$container.css({
        position: "fixed",
        display: "section",
        height: this.$container.height()
      });
      _scroll = this.$container.data("scroll");
      this.scroll = function(value) {
        if (value != null) _scroll = Math.max(0, value);
        return _scroll;
      };
      _transition = 0;
      this.transition = function(value) {
        if (value != null) {
          _transition = Math.min(1, Math.max(0, value));
          this.ontransition(_transition);
        }
        return _transition;
      };
    };

    ScrollSection.prototype.top = function(y, o) {
      if (y != null) {
        this.$container.css({
          top: y
        });
        if (o != null) this.transition(o / this.scroll());
      }
      return this.$container.position().top;
    };

    ScrollSection.prototype.height = function(height) {
      if (height != null) {
        this.$container.css({
          height: Math.max(0, height)
        });
      }
      return this.$container.height();
    };

    ScrollSection.prototype.ontransition = function(value) {
      this.$container.html(value);
    };

    return ScrollSection;

  })();

  BackgroundSection = (function(_super) {

    __extends(BackgroundSection, _super);

    BackgroundSection.prototype.image = null;

    function BackgroundSection(elm) {
      BackgroundSection.__super__.constructor.call(this, elm);
      return;
    }

    BackgroundSection.prototype.init = function() {
      var _this = this;
      this.image = new Image();
      this.image.onload = function() {
        return _this.loaded();
      };
      this.image.src = this.$container.css('background-image').replace(/"/g, "").replace(/url\(|\)$/ig, "");
      BackgroundSection.__super__.init.apply(this, arguments);
    };

    BackgroundSection.prototype.ontransition = function() {
      var y;
      if (this.image.height === 0) return;
      y = this.transition() * (this.height() - this.image.height);
      return this.$container.css({
        backgroundPosition: "0 " + y + "px"
      });
    };

    BackgroundSection.prototype.loaded = function() {
      this.onTransition();
    };

    return BackgroundSection;

  })(ScrollSection);

  ScrollManager = (function() {

    ScrollManager.ALIGN_CENTER = "center";

    ScrollManager.ALIGN_TOP = "top";

    ScrollManager.WINDOW_HEIGHT = -1;

    ScrollManager.prototype.scrollTable = void 0;

    ScrollManager.prototype.scrollValue = void 0;

    ScrollManager.prototype.options = void 0;

    function ScrollManager(options) {
      var index, _container, _dist, _sections;
      this.options = {
        align: ScrollManager.ALIGN_TOP,
        debug: false
      };
      for (index in this.options) {
        if ((options != null) && (options[index] != null)) {
          this.options[index] = options[index];
        }
      }
      ScrollManager.WINDOW_HEIGHT = $(window).height();
      _container = void 0;
      this.container = function() {
        if (_container == null) {
          _container = $("<div class='scroll-manager'></div>");
          _container.css({
            height: ScrollManager.WINDOW_HEIGHT
          });
          _container.appendTo($('body'));
        }
        return _container;
      };
      _sections = [];
      this.sections = function(section) {
        if (section && section instanceof ScrollSection) {
          _sections.push(section);
          section.$container.appendTo(this.container());
          return this.setHeight();
        } else if (section) {
          throw new TypeError("expected ScrollSection object");
        } else {
          return _sections;
        }
      };
      _dist = void 0;
      this.pageDist = function(y) {
        var a, b, x;
        if (y != null) {
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
      var section, _i, _len, _ref,
        _this = this;
      _ref = $('#main').find("section");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        switch ($(section).data("class")) {
          case "BackgroundSection":
            this.sections(new BackgroundSection(section));
            break;
          default:
            this.sections(new ScrollSection(section));
        }
      }
      $(window).scroll(function(event) {
        return _this.onWindowScroll(event);
      });
      $(window).resize(function(event) {
        return _this.onWindowResize(event);
      });
      $(window).resize();
    };

    ScrollManager.prototype.setHeight = function() {
      var section, _height, _i, _len, _ref;
      _height = 0;
      _ref = this.sections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        _height += section.height() + section.scroll();
      }
      if (this.sections()[this.sections().length - 1]) {
        _height -= this.sections()[this.sections().length - 1].height();
      }
      _height += ScrollManager.WINDOW_HEIGHT;
      return this.container().height(_height);
    };

    ScrollManager.prototype.rebuildScrollTable = function() {
      var f, h, i, s, section, y, _i, _j, _len, _len2, _ref, _ref2;
      if (this.options.align === ScrollManager.ALIGN_CENTER) {
        this.scrollTable = [];
        y = Math.round(ScrollManager.WINDOW_HEIGHT * 0.5);
        f = true;
        _ref = this.sections();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          s = section.scroll();
          h = section.height() * 0.5;
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
        _ref2 = this.sections();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          section = _ref2[_j];
          s = section.scroll();
          h = section.height();
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
      var c, section, y, _i, _j, _len, _len2, _ref, _ref2;
      y = this.scrollValue;
      c = Math.round(ScrollManager.WINDOW_HEIGHT * 0.5);
      if (this.options.align === ScrollManager.ALIGN_CENTER) {
        _ref = this.sections();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          section = _ref[_i];
          if (y < c - section.height() * 0.5) {
            section.top(y, section.scroll());
          } else if (y === c - section.height() * 0.5) {
            section.top(y, this.pageDist());
          } else {
            section.top(y, 0);
          }
          y += section.height();
        }
      } else {
        _ref2 = this.sections();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          section = _ref2[_j];
          if (y < 0) {
            section.top(y, section.scroll());
          } else if (y === 0) {
            section.top(y, this.pageDist());
          } else {
            section.top(y, 0);
          }
          y += section.height();
        }
      }
    };

    ScrollManager.prototype.pageScroll = function(y) {
      var x;
      if (y == null) y = $(window).scrollTop();
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

  $(document).ready(function() {
    var manager;
    console.log("٩(×̯×)۶ we are kramgo ٩(×̯×)۶");
    console.log("----^*_ScrollManager_*^----");
    console.log("Copyright Alexander Aivars");
    manager = new ScrollManager({
      align: ScrollManager.ALIGN_CENTER
    });
    manager.init();
  });

}).call(this);
