################################################################################
#
# Utils
#
################################################################################
$ = jQuery

window.console ?=
  log:->
    return
  
################################################################################
#
# Class: ScrollBlock
#
################################################################################
class ScrollBlock
  $container: null
  scroll:0
  activated: null
  isScrolling: false
  constructor: (elm) ->
    @$container = if elm instanceof jQuery then elm else $(elm)
    # console.log @$container.data("scroll")
    @scroll = @$container.data("scroll")
    @activated = new signals.Signal()
    @init()
    return
  init: () ->
    @$container.css({
      position:"fixed"
      width:@$container.width()
      height:@$container.height()
      top: $(window).height()
    })

    _top = 0
    @top = (value) ->
      if value
        _top = value
      return _top

    return
  transition:(value) ->
    @$container.html(value)
    return
  height: () ->
    return @$container.height()
  active: (x) ->
    @activated.dispatch(@)
    return @top() <= x && ( @top() + @scroll ) >= x
  passed: (x) ->
    return ( @top() + @scroll ) < x
  scrollTo: (x,dist) ->
    
    if dist >= 0 && dist <= @scroll
      @isScrolling = true
    else
      @isScrolling = false

    ###
    if @active(x)
      @transition  (x - @top()) / @scroll
      x = @top()
    else if @passed(x)
      x = x - @scroll
      @transition 1
    else
      @transition 0

    @$container.css({
      top:@top() - x
    })
    ###

    @$container.css({
      top: x
    })

    return
    

    

################################################################################
#
# Class: ScrollManager
#
################################################################################
class ScrollManager
  blocks: []
  constructor: () ->
    $(window).scroll (event) => @scrolled(event)
    return
  init:() ->

    # wrapp scrollable ellements
    for block in $('#main').find(".scroll-block")
      @blocks.push new ScrollBlock(block)
    

    # add singal listners
    # for block in @blocks
    @blocks[0].activated.add (target) => @onActivated()

    # callculate layout for scrollable ellements
    # ypos = 0
    # for block in @blocks
    #  block.top(ypos)
    #  ypos += block.height()
    
    @scrolled()
    return
  layout:() ->

    return
  scrolled:() ->
    scroll = $(window).scrollTop()

    #layout scrollable elements
    console.log "--------------------"

    offset = 0
    for block,i in @blocks
      # console.log i + ":" + ( scroll + offset) + ":" + (scroll - offset)
      block.scrollTo(-scroll + offset, scroll - offset )
      console.log i + ":" + block.isScrolling
      offset += block.height()
    return
  onActivated: (e) ->
    # console.log "onActivated"
    # console.log @
    # console.log e


