
/*
  it 'should set block transistion value', ->
    manager.rebuildScrollTable()
    for i in [0..1]
      manager.blockScroll(i)
      expect( manager.blocks()[0].transition() ).toEqual( 0.02 )
*/

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
      it('should add blocks to container element', function() {
        var block;
        block = new ScrollBlock(sandbox());
        manager.blocks(block);
        expect(manager.container()).toContain(block.$container);
      });
      return it('should resize content wrapper to match block content', function() {
        var h1, h2, h3, s1, s2, s3;
        h1 = 100;
        h2 = 200;
        h3 = 300;
        s1 = 110;
        s2 = 220;
        s3 = 330;
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: " + h1 + "px",
          "data-scroll": s1
        })));
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: " + h2 + "px",
          "data-scroll": s2
        })));
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: " + h3 + "px",
          "data-scroll": s3
        })));
        expect(manager.container().height()).toEqual(h1 + h2 + h3 + s1 + s2 + s3 + $(window).height() - h3);
      });
    });
    describe('block layout', function() {
      it('should by default align blocks by top value ', function() {
        var elm, manager, _i, _len, _ref;
        loadFixtures("scrollmanager/blocks.html");
        manager = new ScrollManager();
        _ref = $('#scroll-block-fixture').find('.scroll-block');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          manager.blocks(new ScrollBlock(elm));
        }
        manager.rebuildScrollTable();
        manager.pageScroll(0);
        expect(manager.blocks()[0].top()).toEqual(0);
        expect(manager.blocks()[1].top()).toEqual(200);
        expect(manager.blocks()[2].top()).toEqual(400);
      });
      return it('should be able to center align block to center of window ', function() {
        var center, manager;
        loadFixtures("scrollmanager/blocks.html");
        manager = new ScrollManager({
          align: "center"
        });
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 200px",
          "data-scroll": 50
        })));
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 100px",
          "data-scroll": 50
        })));
        manager.blocks(new ScrollBlock(sandbox({
          style: "height: 150px",
          "data-scroll": 50
        })));
        manager.rebuildScrollTable();
        center = $(window).height() * 0.5;
        manager.pageScroll(0);
        expect(manager.blocks()[0].top()).toEqual(center - 100 + 0);
        expect(manager.blocks()[1].top()).toEqual(center - 100 + 200);
        expect(manager.blocks()[2].top()).toEqual(center - 100 + 300);
        manager.pageScroll(51);
        expect(manager.blocks()[0].top()).toEqual(center - 100 + 0 - 1);
        expect(manager.blocks()[1].top()).toEqual(center - 100 + 200 - 1);
        expect(manager.blocks()[2].top()).toEqual(center - 100 + 300 - 1);
        manager.pageScroll(150);
        expect(manager.blocks()[0].top()).toEqual(center - 200);
        expect(manager.blocks()[1].top()).toEqual(center);
        expect(manager.blocks()[2].top()).toEqual(center + 100);
        manager.pageScroll(200);
        expect(manager.blocks()[0].top()).toEqual(center - 250);
        expect(manager.blocks()[1].top()).toEqual(center - 50);
        expect(manager.blocks()[2].top()).toEqual(center + 50);
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
      it('should not be able to scroll to negative values', function() {
        manager.pageScroll(-1);
        expect(manager.blocks()[0].top()).toEqual(0);
        expect(manager.blocks()[1].top()).toEqual(200);
        expect(manager.blocks()[2].top()).toEqual(400);
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
    });
  });

}).call(this);
