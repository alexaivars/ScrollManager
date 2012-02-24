(function() {
  describe('ScrollManager', function() {
    describe('object', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        $('body').empty();
        return manager = new ScrollManager();
      });
      it('matches an instance of ScrollManager', function() {
        expect(manager).toEqual(jasmine.any(ScrollManager));
        return expect(manager).not.toBeNull();
      });
      it('initializes', function() {
        loadFixtures("scrollmanager/blocks.html");
        manager.init();
      });
      it('should contain a ScrollManager DOM wrapper element', function() {
        expect(manager.container()).toExist();
        expect(manager.container()).toEqual(manager.container());
        expect(manager.container()).toHaveClass("scroll-manager");
        expect($('body')).toContain(manager.container());
      });
      describe('DOM handlers', function() {});
      manager = void 0;
      beforeEach(function() {
        $('body').empty();
        manager = new ScrollManager();
      });
      it('should be able to add and retreve blocks', function() {
        var block;
        block = new ScrollBlock(sandbox());
        manager.blocks(block);
        expect(manager.blocks()[0]).toEqual(block);
      });
      it('should be able to layout blocks', function() {
        var elm, _i, _len, _ref;
        loadFixtures("scrollmanager/blocks.html");
        _ref = $('#scroll-block-fixture').find('.scroll-block');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          manager.blocks(new ScrollBlock(elm));
        }
        manager.render();
        expect(manager.blocks()[0].top()).toEqual(0);
        expect(manager.blocks()[1].top()).toEqual(200);
        expect(manager.blocks()[2].top()).toEqual(400);
      });
      it('should add blocks to container element', function() {
        var block;
        block = new ScrollBlock(sandbox());
        manager.blocks(block);
        expect(manager.container()).toContain(block.$container);
      });
      return it('should resize content wrapper to match block content', function() {
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 100px",
          "data-scroll": 200
        })));
        expect(manager.container().height()).toEqual(300 + $(window).height());
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 300px",
          "data-scroll": 400
        })));
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 400px",
          "data-scroll": 600
        })));
        expect(manager.container().height()).toEqual(2000 + $(window).height());
      });
    });
    return describe('pageScroll', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        var elm, _i, _len, _ref;
        loadFixtures("scrollmanager/blocks.html");
        manager = new ScrollManager();
        _ref = $('#scroll-block-fixture').find('.scroll-block');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          manager.blocks(new ScrollBlock(elm));
        }
        manager.rebuildScrollTable();
      });
      it('should be able to scroll blocks according to individual blocks scroll length', function() {
        var i;
        for (i = 0; i <= 50; i++) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(0);
          expect(manager.blocks()[1].top()).toEqual(200);
          expect(manager.blocks()[2].top()).toEqual(400);
        }
        for (i = 50; i <= 250; i++) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(-i + 50 + 0);
          expect(manager.blocks()[1].top()).toEqual(-i + 50 + 200);
          expect(manager.blocks()[2].top()).toEqual(-i + 50 + 400);
        }
        for (i = 250; i <= 300; i++) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(-200);
          expect(manager.blocks()[1].top()).toEqual(0);
          expect(manager.blocks()[2].top()).toEqual(200);
        }
        for (i = 300; i <= 301; i++) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(-i + 100 - 0);
          expect(manager.blocks()[1].top()).toEqual(-i + 100 + 200);
          expect(manager.blocks()[2].top()).toEqual(-i + 100 + 400);
        }
      });
      it('should be able to scroll blocks to negative values', function() {
        var i, _ref;
        for (i = 0, _ref = -1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(0 - i);
          expect(manager.blocks()[1].top()).toEqual(200 - i);
          expect(manager.blocks()[2].top()).toEqual(400 - i);
        }
      });
      return it('should be able to scroll past the last block in the block list', function() {
        var last;
        last = manager.blocks()[manager.blocks().length - 1];
        manager.pageScroll(2200 - 1);
        expect(last.top()).toEqual(-1200 + 1);
        manager.pageScroll(2200 + 0);
        expect(last.top()).toEqual(-1200 + 0);
        manager.pageScroll(2200 + 1);
        expect(last.top()).toEqual(-1200 - 1);
      });
      /*
          it 'should set block transistion value', ->
            manager.rebuildScrollTable()
            for i in [0..1]
              manager.blockScroll(i)
              expect( manager.blocks()[0].transition() ).toEqual( 0.02 )
          */
    });
  });
}).call(this);
