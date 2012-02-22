describe 'ScrollManager', ->
  describe 'ScrollManager object constrution', ->
    manager = undefined

    beforeEach ->
      manager = new ScrollManager()

    it 'matches an instance of ScrollManager', ->
      expect( manager ).toEqual(jasmine.any(ScrollManager))
      expect( manager ).not.toBeNull()
 

