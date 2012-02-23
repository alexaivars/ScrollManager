 
  describe 'ScrollBlock object constrution', ->
    block = undefined

    beforeEach ->
      block = new ScrollBlock( sandbox() )
      return
    
    it 'matches an instance of ScrollBlock', ->
      expect( block ).toEqual(jasmine.any(ScrollBlock))
      expect( block ).not.toBeNull()
      return

    it 'should expose related dom element wrapped in a jquery object', ->
      $elm = sandbox()
      block = new ScrollBlock($elm)
      expect( block.$container ).toEqual( jasmine.any(jQuery) )
      expect( block.$container.get(0) ).toEqual( $elm.get(0) )
      return

    it 'should load scroll length from dom element data attribute', ->
      $elm = sandbox({"data-scroll":123})
      block = new ScrollBlock($elm)
      expect( block.scroll() ).toEqual(123)
      return
  
  describe 'Update scroll status', ->
    block = undefined
    beforeEach ->
      $elm = sandbox()
      $elm.appendTo('body')
      block = new ScrollBlock($elm)
      return

    it 'should be able to set and get the height', ->
      expect( block.height(-1) ).toEqual(0) # height can not be negativ
      expect( block.height(1) ).toEqual(1)
      expect( block.height(0) ).toEqual(0)
      return

    it 'should be able to set and get the scroll length', ->
      expect( block.scroll(-1) ).toEqual(0) # scroll length can not be negativ
      expect( block.scroll(1) ).toEqual(1)
      expect( block.scroll(0) ).toEqual(0)
      return
    
    it 'should be able to set and get the top position', ->
      expect( block.top(-1) ).toEqual(-1)
      expect( block.top(0) ).toEqual(0)
      expect( block.top(1) ).toEqual(1)
      return
    
    it 'should be able to set and the current transition', ->
      expect( block.transition(-1) ).toEqual(0)
      expect( block.transition(0) ).toEqual(0)
      expect( block.transition(0.5) ).toEqual(0.5)
      expect( block.transition(1) ).toEqual(1)
      expect( block.transition(2) ).toEqual(1)
      return
    
    
    it 'should be able to pass dist to top set transition progress', ->
      
      block = new ScrollBlock sandbox({
        "data-scroll":"50"
        "style":"width:100px; height:100px;"
      })

      for i in [0..50]
        block.top(0,i)
        expect( block.transition().toFixed(4) ).toEqual( (0.02 * i).toFixed(4) )
    



