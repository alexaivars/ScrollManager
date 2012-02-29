###
  it 'should set section transistion value', ->
    manager.rebuildScrollTable()
    for i in [0..1]
      manager.sectionScroll(i)
      expect( manager.sections()[0].transition() ).toEqual( 0.02 )
###

describe 'ScrollManager', ->
  
  describe 'object', ->
    manager = undefined

    beforeEach ->
      $('body').empty()
      manager = new ScrollManager()

    it 'matches an instance of ScrollManager', ->
      expect( manager ).toEqual(jasmine.any(ScrollManager))
      expect( manager ).not.toBeNull()
 
    it 'initializes', ->
      loadFixtures "scrollmanager/sections.html"
      manager.init()
      return

    it 'should contain a ScrollManager DOM wrapper element', ->
      expect( manager.container() ).toExist()
      expect( manager.container() ).toEqual( manager.container() )
      expect( manager.container() ).toHaveClass("scroll-manager")
      expect( $('body') ).toContain( manager.container() )
      # expect( manager.container() )
      return

    describe 'DOM handlers', ->

    manager = undefined
    
    beforeEach ->
      $('body').empty()
      manager = new ScrollManager()
      return
    
    it 'should be able to add and retreve sections', ->
      section = new ScrollSection(sandbox())
      manager.sections section
      expect( manager.sections()[0] ).toEqual( section )
      return

    #it 'should be able to layout sections', ->
    #  loadFixtures "scrollmanager/sections.html"
    #  for elm in $('#scroll-section-fixture').find('.scroll-section')
    #    manager.sections new ScrollSection(elm)
    #  manager.render()
    #  expect( manager.sections()[0].top() ).toEqual( 0 )
    #  expect( manager.sections()[1].top() ).toEqual( 200 )
    #  expect( manager.sections()[2].top() ).toEqual( 400 )
    #  return

    it 'should add sections to container element', ->
      section =  new ScrollSection(sandbox())
      manager.sections section
      expect( manager.container() ).toContain( section.$container )
      return

    it 'should resize content wrapper to match section content', ->
      h1 = 100
      h2 = 200
      h3 = 300
      s1 = 110
      s2 = 220
      s3 = 330
      manager.sections new ScrollSection(sandbox({style: "height: #{ h1 }px","data-scroll":s1}))
      manager.sections new ScrollSection(sandbox({style: "height: #{ h2 }px","data-scroll":s2}))
      manager.sections new ScrollSection(sandbox({style: "height: #{ h3 }px","data-scroll":s3}))
      expect( manager.container().height() ).toEqual(h1 + h2 + h3 + s1 + s2 + s3 + $(window).height() - h3)
      return

  describe 'section layout', ->
    
    it 'should by default align sections by top value ', ->
      loadFixtures "scrollmanager/sections.html"
      manager = new ScrollManager()
      for elm in $('#scroll-section-fixture').find('.scroll-section')
        manager.sections new ScrollSection(elm)
      manager.rebuildScrollTable()
      manager.pageScroll(0)
      expect( manager.sections()[0].top() ).toEqual( 0 )
      expect( manager.sections()[1].top() ).toEqual( 200 )
      expect( manager.sections()[2].top() ).toEqual( 400 )
      return
    
    it 'should be able to center align section to center of window ', ->
      loadFixtures "scrollmanager/sections.html"
      manager = new ScrollManager({align:"center"})
      manager.sections new ScrollSection(sandbox({style: "height: 200px","data-scroll":50}))
      manager.sections new ScrollSection(sandbox({style: "height: 100px","data-scroll":50}))
      manager.sections new ScrollSection(sandbox({style: "height: 150px","data-scroll":50}))
      manager.rebuildScrollTable()
      center = $(window).height() * 0.5

      manager.pageScroll(0)
      expect( manager.sections()[0].top() ).toEqual( center - 100 + 0 )
      expect( manager.sections()[1].top() ).toEqual( center - 100 + 200 )
      expect( manager.sections()[2].top() ).toEqual( center - 100 + 300 )

      manager.pageScroll(51)
      expect( manager.sections()[0].top() ).toEqual( center - 100 + 0 - 1)
      expect( manager.sections()[1].top() ).toEqual( center - 100 + 200 - 1)
      expect( manager.sections()[2].top() ).toEqual( center - 100 + 300 - 1)

      manager.pageScroll(150)
      expect( manager.sections()[0].top() ).toEqual( center - 200 )
      expect( manager.sections()[1].top() ).toEqual( center )
      expect( manager.sections()[2].top() ).toEqual( center + 100 )

      manager.pageScroll(200)
      expect( manager.sections()[0].top() ).toEqual( center - 250 )
      expect( manager.sections()[1].top() ).toEqual( center - 50)
      expect( manager.sections()[2].top() ).toEqual( center + 50 )

      return
  
  describe 'pageScroll', ->
    
    manager = undefined
    
    beforeEach ->
      loadFixtures "scrollmanager/sections.html"
      manager = new ScrollManager()
      for elm in $('#scroll-section-fixture').find('.scroll-section')
        manager.sections new ScrollSection(elm)
      manager.rebuildScrollTable()
      return

    it 'should not be able to scroll to negative values', ->
      manager.pageScroll(-1)
      expect( manager.sections()[0].top() ).toEqual( 0 )
      expect( manager.sections()[1].top() ).toEqual( 200 )
      expect( manager.sections()[2].top() ).toEqual( 400 )
      return
    
    it 'should be able to scroll sections according to individual sections scroll length', ->
      for i in [0..50]
        manager.pageScroll(i)
        expect( manager.sections()[0].top() ).toEqual( 0 )
        expect( manager.sections()[1].top() ).toEqual( 200 )
        expect( manager.sections()[2].top() ).toEqual( 400 )
      for i in [50..250]
        manager.pageScroll(i)
        expect( manager.sections()[0].top() ).toEqual( -i + 50 + 0 )
        expect( manager.sections()[1].top() ).toEqual( -i + 50 + 200 )
        expect( manager.sections()[2].top() ).toEqual( -i + 50 + 400 )
      for i in [250..300]
        manager.pageScroll(i)
        expect( manager.sections()[0].top() ).toEqual( -200 )
        expect( manager.sections()[1].top() ).toEqual( 0 )
        expect( manager.sections()[2].top() ).toEqual( 200 )
      for i in [300..301]
        manager.pageScroll(i)
        expect( manager.sections()[0].top() ).toEqual( -i + 100 - 0 )
        expect( manager.sections()[1].top() ).toEqual( -i + 100 + 200 )
        expect( manager.sections()[2].top() ).toEqual( -i + 100 + 400 )
      return 
    
    it 'should be able to scroll past the last section in the section list', ->
      last = manager.sections()[manager.sections().length - 1]
      manager.pageScroll( 2200 - 1 )
      expect( last.top() ).toEqual( -1200 + 1)
      manager.pageScroll( 2200 + 0 )
      expect( last.top() ).toEqual( -1200 + 0)
      manager.pageScroll( 2200 + 1 )
      expect( last.top() ).toEqual( -1200 - 1)
      return

