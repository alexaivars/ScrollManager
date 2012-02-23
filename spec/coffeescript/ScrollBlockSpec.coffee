 
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

    it 'should be able to set the height', ->
      expect( block.height(-1) ).toEqual(0) # height can not be negativ
      expect( block.height(1) ).toEqual(1)
      expect( block.height(0) ).toEqual(0)
      return

    it 'should be able to set the scroll length', ->
      expect( block.scroll(-1) ).toEqual(0) # scroll length can not be negativ
      expect( block.scroll(1) ).toEqual(1)
      expect( block.scroll(0) ).toEqual(0)
      return
    
    it 'should be able to top position', ->
      expect( block.top(-1) ).toEqual(-1)
      expect( block.top(0) ).toEqual(0)
      expect( block.top(1) ).toEqual(1)
      return



