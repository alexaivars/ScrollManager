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
      loadFixtures "scrollmanager/blocks.html"
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
    
    it 'should be able to add and retreve blocks', ->
      block = new ScrollBlock(sandbox())
      manager.blocks block
      expect( manager.blocks()[0] ).toEqual( block )
      return

    it 'should be able to layout blocks', ->
      loadFixtures "scrollmanager/blocks.html"
      for elm in $('#scroll-block-fixture').find('.scroll-block')
        manager.blocks new ScrollBlock(elm)
      manager.render()
      expect( manager.blocks()[0].top() ).toEqual( 0 )
      expect( manager.blocks()[1].top() ).toEqual( 200 )
      expect( manager.blocks()[2].top() ).toEqual( 400 )
      return

    it 'should add blocks to container element', ->
      block =  new ScrollBlock(sandbox())
      manager.blocks block
      expect( manager.container() ).toContain( block.$container )
      return

    it 'should resize content wrapper to match block content', ->
      manager.blocks new ScrollBlock(sandbox({style: "height: 100px","data-scroll":200}))
      expect( manager.container().height() ).toEqual(300 + $(window).height())
      manager.blocks new ScrollBlock(sandbox({style: "height: 300px","data-scroll":400}))
      manager.blocks new ScrollBlock(sandbox({style: "height: 400px","data-scroll":600}))
      expect( manager.container().height() ).toEqual(2000 + $(window).height())
      return
  
  describe 'pageScroll', ->
    
    manager = undefined
    
    beforeEach ->
      loadFixtures "scrollmanager/blocks.html"
      manager = new ScrollManager()
      for elm in $('#scroll-block-fixture').find('.scroll-block')
        manager.blocks new ScrollBlock(elm)
      manager.rebuildScrollTable()
      return

    it 'should be able to scroll blocks according to individual blocks scroll length', ->
      for i in [0..50]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( 0 )
        expect( manager.blocks()[1].top() ).toEqual( 200 )
        expect( manager.blocks()[2].top() ).toEqual( 400 )
      for i in [50..250]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( -i + 50 + 0 )
        expect( manager.blocks()[1].top() ).toEqual( -i + 50 + 200 )
        expect( manager.blocks()[2].top() ).toEqual( -i + 50 + 400 )
      for i in [250..300]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( -200 )
        expect( manager.blocks()[1].top() ).toEqual( 0 )
        expect( manager.blocks()[2].top() ).toEqual( 200 )
      for i in [300..301]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( -i + 100 - 0 )
        expect( manager.blocks()[1].top() ).toEqual( -i + 100 + 200 )
        expect( manager.blocks()[2].top() ).toEqual( -i + 100 + 400 )
      return

    it 'should be able to scroll blocks to negative values', ->
      for i in [0..-1]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( 0 - i )
        expect( manager.blocks()[1].top() ).toEqual( 200 - i )
        expect( manager.blocks()[2].top() ).toEqual( 400 - i )
      return
    
    it 'should be able to scroll past the last block in the block list', ->
      last = manager.blocks()[manager.blocks().length - 1]
      manager.pageScroll( 2200 - 1 )
      expect( last.top() ).toEqual( -1200 + 1)
      manager.pageScroll( 2200 + 0 )
      expect( last.top() ).toEqual( -1200 + 0)
      manager.pageScroll( 2200 + 1 )
      expect( last.top() ).toEqual( -1200 - 1)
      return

    ###
    it 'should set block transistion value', ->
      manager.rebuildScrollTable()
      for i in [0..1]
        manager.blockScroll(i)
        expect( manager.blocks()[0].transition() ).toEqual( 0.02 )
    ###
