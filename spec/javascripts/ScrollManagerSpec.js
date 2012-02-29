
/*
  it 'should set section transistion value', ->
    manager.rebuildScrollTable()
    for i in [0..1]
      manager.sectionScroll(i)
      expect( manager.sections()[0].transition() ).toEqual( 0.02 )
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
        loadFixtures("scrollmanager/sections.html");
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
      it('should be able to add and retreve sections', function() {
        var section;
        section = new ScrollSection(sandbox());
        manager.sections(section);
        expect(manager.sections()[0]).toEqual(section);
      });
      it('should add sections to container element', function() {
        var section;
        section = new ScrollSection(sandbox());
        manager.sections(section);
        expect(manager.container()).toContain(section.$container);
      });
      return it('should resize content wrapper to match section content', function() {
        var h1, h2, h3, s1, s2, s3;
        h1 = 100;
        h2 = 200;
        h3 = 300;
        s1 = 110;
        s2 = 220;
        s3 = 330;
        manager.sections(new ScrollSection(sandbox({
          style: "height: " + h1 + "px",
          "data-scroll": s1
        })));
        manager.sections(new ScrollSection(sandbox({
          style: "height: " + h2 + "px",
          "data-scroll": s2
        })));
        manager.sections(new ScrollSection(sandbox({
          style: "height: " + h3 + "px",
          "data-scroll": s3
        })));
        expect(manager.container().height()).toEqual(h1 + h2 + h3 + s1 + s2 + s3 + $(window).height() - h3);
      });
    });
    describe('section layout', function() {
      it('should by default align sections by top value ', function() {
        var elm, manager, _i, _len, _ref;
        loadFixtures("scrollmanager/sections.html");
        manager = new ScrollManager();
        _ref = $('#scroll-section-fixture').find('.scroll-section');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          manager.sections(new ScrollSection(elm));
        }
        manager.rebuildScrollTable();
        manager.pageScroll(0);
        expect(manager.sections()[0].top()).toEqual(0);
        expect(manager.sections()[1].top()).toEqual(200);
        expect(manager.sections()[2].top()).toEqual(400);
      });
      return it('should be able to center align section to center of window ', function() {
        var center, manager;
        loadFixtures("scrollmanager/sections.html");
        manager = new ScrollManager({
          align: "center"
        });
        manager.sections(new ScrollSection(sandbox({
          style: "height: 200px",
          "data-scroll": 50
        })));
        manager.sections(new ScrollSection(sandbox({
          style: "height: 100px",
          "data-scroll": 50
        })));
        manager.sections(new ScrollSection(sandbox({
          style: "height: 150px",
          "data-scroll": 50
        })));
        manager.rebuildScrollTable();
        center = $(window).height() * 0.5;
        manager.pageScroll(0);
        expect(manager.sections()[0].top()).toEqual(center - 100 + 0);
        expect(manager.sections()[1].top()).toEqual(center - 100 + 200);
        expect(manager.sections()[2].top()).toEqual(center - 100 + 300);
        manager.pageScroll(51);
        expect(manager.sections()[0].top()).toEqual(center - 100 + 0 - 1);
        expect(manager.sections()[1].top()).toEqual(center - 100 + 200 - 1);
        expect(manager.sections()[2].top()).toEqual(center - 100 + 300 - 1);
        manager.pageScroll(150);
        expect(manager.sections()[0].top()).toEqual(center - 200);
        expect(manager.sections()[1].top()).toEqual(center);
        expect(manager.sections()[2].top()).toEqual(center + 100);
        manager.pageScroll(200);
        expect(manager.sections()[0].top()).toEqual(center - 250);
        expect(manager.sections()[1].top()).toEqual(center - 50);
        expect(manager.sections()[2].top()).toEqual(center + 50);
      });
    });
    return describe('pageScroll', function() {
      var manager;
      manager = void 0;
      beforeEach(function() {
        var elm, _i, _len, _ref;
        loadFixtures("scrollmanager/sections.html");
        manager = new ScrollManager();
        _ref = $('#scroll-section-fixture').find('.scroll-section');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          manager.sections(new ScrollSection(elm));
        }
        manager.rebuildScrollTable();
      });
      it('should not be able to scroll to negative values', function() {
        manager.pageScroll(-1);
        expect(manager.sections()[0].top()).toEqual(0);
        expect(manager.sections()[1].top()).toEqual(200);
        expect(manager.sections()[2].top()).toEqual(400);
      });
      it('should be able to scroll sections according to individual sections scroll length', function() {
        var i;
        for (i = 0; i <= 50; i++) {
          manager.pageScroll(i);
          expect(manager.sections()[0].top()).toEqual(0);
          expect(manager.sections()[1].top()).toEqual(200);
          expect(manager.sections()[2].top()).toEqual(400);
        }
        for (i = 50; i <= 250; i++) {
          manager.pageScroll(i);
          expect(manager.sections()[0].top()).toEqual(-i + 50 + 0);
          expect(manager.sections()[1].top()).toEqual(-i + 50 + 200);
          expect(manager.sections()[2].top()).toEqual(-i + 50 + 400);
        }
        for (i = 250; i <= 300; i++) {
          manager.pageScroll(i);
          expect(manager.sections()[0].top()).toEqual(-200);
          expect(manager.sections()[1].top()).toEqual(0);
          expect(manager.sections()[2].top()).toEqual(200);
        }
        for (i = 300; i <= 301; i++) {
          manager.pageScroll(i);
          expect(manager.sections()[0].top()).toEqual(-i + 100 - 0);
          expect(manager.sections()[1].top()).toEqual(-i + 100 + 200);
          expect(manager.sections()[2].top()).toEqual(-i + 100 + 400);
        }
      });
      return it('should be able to scroll past the last section in the section list', function() {
        var last;
        last = manager.sections()[manager.sections().length - 1];
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
