describe 'ScrollManager', ->
  
  describe 'ScrollManager object constrution', ->
    manager = undefined

    beforeEach ->
      manager = new ScrollManager()

    it 'matches an instance of ScrollManager', ->
      expect( manager ).toEqual(jasmine.any(ScrollManager))
      expect( manager ).not.toBeNull()
 
    it 'initializes', ->
      loadFixtures "scrollmanager/blocks.html"
      manager.init()

    it 'should be able to add and retreve blocks', ->
      block = new ScrollBlock(sandbox())
      manager.blocks block
      expect( manager.blocks()[0] ).toEqual( block )

  describe 'Manipulate ScrollBlock', ->
    manager = undefined
    
    beforeEach ->
      loadFixtures "scrollmanager/blocks.html"
      manager = new ScrollManager()
      for elm in $('#scroll-block-fixture').find('.scroll-block')
        manager.blocks new ScrollBlock(elm)
       
    it 'should be able to layout blocks', ->
      manager.render()
      expect( manager.blocks()[0].top() ).toEqual( 0 )
      expect( manager.blocks()[1].top() ).toEqual( 200 )
      expect( manager.blocks()[2].top() ).toEqual( 400 )
    
   
    ###
    it 'should be able to scroll blocks', ->
      manager.rebuildScrollTable()
      for i in [-100..100]
        manager.blockScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( i )
        expect( manager.blocks()[1].top() ).toEqual( i + 200 )
        expect( manager.blocks()[2].top() ).toEqual( i + 400 )
    ###
    
    it 'should be able to scroll blocks according to individual blocks scroll length', ->
      manager.rebuildScrollTable()
      
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
    
    it 'should be able to scroll blocks to negative values', ->
      manager.rebuildScrollTable()
      for i in [0..-1]
        manager.pageScroll(i)
        expect( manager.blocks()[0].top() ).toEqual( 0 - i )
        expect( manager.blocks()[1].top() ).toEqual( 200 - i )
        expect( manager.blocks()[2].top() ).toEqual( 400 - i )
    
    
    it 'should be able to scroll past the last block in the block list', ->
      manager.rebuildScrollTable()
      last = manager.blocks()[manager.blocks().length - 1]

      manager.pageScroll( 2200 - 1 )
      expect( last.top() ).toEqual( -1200 + 1)

      manager.pageScroll( 2200 + 0 )
      expect( last.top() ).toEqual( -1200 + 0)

      manager.pageScroll( 2200 + 1 )
      expect( last.top() ).toEqual( -1200 - 1)

    ###
    it 'should set block transistion value', ->
      manager.rebuildScrollTable()
      for i in [0..1]
        manager.blockScroll(i)
        expect( manager.blocks()[0].transition() ).toEqual( 0.02 )
    ###
