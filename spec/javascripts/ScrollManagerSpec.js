(function() {
  describe('ScrollManager', function() {
    describe('ScrollManager object constrution', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        return manager = new ScrollManager();
      });
      it('matches an instance of ScrollManager', function() {
        expect(manager).toEqual(jasmine.any(ScrollManager));
        return expect(manager).not.toBeNull();
      });
      it('initializes', function() {
        loadFixtures("scrollmanager/blocks.html");
        return manager.init();
      });
      return it('should be able to add and retreve blocks', function() {
        var block;
        block = new ScrollBlock(sandbox());
        manager.blocks(block);
        return expect(manager.blocks()[0]).toEqual(block);
      });
    });
    return describe('Manipulate ScrollBlock', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        var elm, _i, _len, _ref, _results;
        loadFixtures("scrollmanager/blocks.html");
        manager = new ScrollManager();
        _ref = $('#scroll-block-fixture').find('.scroll-block');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          _results.push(manager.blocks(new ScrollBlock(elm)));
        }
        return _results;
      });
      it('should be able to layout blocks', function() {
        manager.render();
        expect(manager.blocks()[0].top()).toEqual(0);
        expect(manager.blocks()[1].top()).toEqual(200);
        return expect(manager.blocks()[2].top()).toEqual(400);
      });
      /*
          it 'should be able to scroll blocks', ->
            manager.rebuildScrollTable()
            for i in [-100..100]
              manager.blockScroll(i)
              expect( manager.blocks()[0].top() ).toEqual( i )
              expect( manager.blocks()[1].top() ).toEqual( i + 200 )
              expect( manager.blocks()[2].top() ).toEqual( i + 400 )
          */
      it('should be able to scroll blocks according to individual blocks scroll length', function() {
        var i, _results;
        manager.rebuildScrollTable();
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
        _results = [];
        for (i = 300; i <= 301; i++) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(-i + 100 - 0);
          expect(manager.blocks()[1].top()).toEqual(-i + 100 + 200);
          _results.push(expect(manager.blocks()[2].top()).toEqual(-i + 100 + 400));
        }
        return _results;
      });
      it('should be able to scroll blocks to negative values', function() {
        var i, _ref, _results;
        manager.rebuildScrollTable();
        _results = [];
        for (i = 0, _ref = -1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          manager.pageScroll(i);
          expect(manager.blocks()[0].top()).toEqual(0 - i);
          expect(manager.blocks()[1].top()).toEqual(200 - i);
          _results.push(expect(manager.blocks()[2].top()).toEqual(400 - i));
        }
        return _results;
      });
      return it('should be able to scroll past the last block in the block list', function() {
        var last;
        manager.rebuildScrollTable();
        last = manager.blocks()[manager.blocks().length - 1];
        manager.pageScroll(2200 - 1);
        expect(last.top()).toEqual(-1200 + 1);
        manager.pageScroll(2200 + 0);
        expect(last.top()).toEqual(-1200 + 0);
        manager.pageScroll(2200 + 1);
        return expect(last.top()).toEqual(-1200 - 1);
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
