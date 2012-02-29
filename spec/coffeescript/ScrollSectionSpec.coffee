 
  describe 'ScrollSection object constrution', ->
    section = undefined

    beforeEach ->
      section = new ScrollSection( sandbox() )
      return
    
    it 'matches an instance of ScrollSection', ->
      expect( section ).toEqual(jasmine.any(ScrollSection))
      expect( section ).not.toBeNull()
      return

    it 'should expose related dom element wrapped in a jquery object', ->
      $elm = sandbox()
      section = new ScrollSection($elm)
      expect( section.$container ).toEqual( jasmine.any(jQuery) )
      expect( section.$container.get(0) ).toEqual( $elm.get(0) )
      return

    it 'should load scroll length from dom element data attribute', ->
      $elm = sandbox({"data-scroll":123})
      section = new ScrollSection($elm)
      expect( section.scroll() ).toEqual(123)
      return
  
  describe 'Update scroll status', ->
    section = undefined
    beforeEach ->
      $elm = sandbox()
      $elm.appendTo('body')
      section = new ScrollSection($elm)
      return

    it 'should be able to set and get the height', ->
      expect( section.height(-1) ).toEqual(0) # height can not be negativ
      expect( section.height(1) ).toEqual(1)
      expect( section.height(0) ).toEqual(0)
      return

    it 'should be able to set and get the scroll length', ->
      expect( section.scroll(-1) ).toEqual(0) # scroll length can not be negativ
      expect( section.scroll(1) ).toEqual(1)
      expect( section.scroll(0) ).toEqual(0)
      return
    
    it 'should be able to set and get the top position', ->
      expect( section.top(-1) ).toEqual(-1)
      expect( section.top(0) ).toEqual(0)
      expect( section.top(1) ).toEqual(1)
      return
    
    it 'should be able to set and the current transition', ->
      expect( section.transition(-1) ).toEqual(0)
      expect( section.transition(0) ).toEqual(0)
      expect( section.transition(0.5) ).toEqual(0.5)
      expect( section.transition(1) ).toEqual(1)
      expect( section.transition(2) ).toEqual(1)
      return
    
    
    it 'should be able to pass dist to top set transition progress', ->
      
      section = new ScrollSection sandbox({
        "data-scroll":"50"
        "style":"width:100px; height:100px;"
      })

      for i in [0..50]
        section.top(0,i)
        expect( section.transition().toFixed(4) ).toEqual( (0.02 * i).toFixed(4) )
    



