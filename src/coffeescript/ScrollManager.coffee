################################################################################
#
# Utils
#
################################################################################
$ = jQuery

window.console ?=
  log:->
    return

## For IE! 
unless Array::lastIndexOf
  Array::lastIndexOf = (searchElement) ->
    "use strict"
    throw new TypeError()  unless this?
    t = Object(this)
    len = t.length >>> 0
    return -1  if len is 0
    n = len
    if arguments.length > 1
      n = Number(arguments[1])
      unless n is n
        n = 0
      else n = (n > 0 or -1) * Math.floor(Math.abs(n))  if n isnt 0 and n isnt (1 / 0) and n isnt -(1 / 0)
    k = (if n >= 0 then Math.min(n, len - 1) else len - Math.abs(n))
    while k >= 0
      return k  if k of t and t[k] is searchElement
      k--
    -1

################################################################################
#
# Class: ScrollBlock
#
################################################################################
class ScrollBlock
  $container: null
  
  constructor: (elm) ->
    @$container = if elm instanceof jQuery then elm else $(elm)
    # console.log @$container.data("scroll")
    #  @scroll = 
    # @activated = new signals.Signal()
    @init()
    return

  init: () ->
    @$container.css({
      position:"fixed"
      display:"block"
      width:@$container.width()
      height:@$container.height()
      # top: $(window).height()
    })

    # private data accessors
    _scroll = @$container.data("scroll")
    @scroll = (value) ->
      if value != undefined
        _scroll = Math.max(0,value)
      return _scroll

    _transition = 0
    @transition = (value) ->
      if value != undefined
        _transition = Math.min(1,Math.max(0,value))
        @$container.html( _transition )
      return _transition

    return

  top: (y,o) ->
    if y != undefined
      @$container.css { top: y }
      if o != undefined && y == 0
        @transition o / @scroll()
      else if y < 0
        @transition 1
      else
        @transition 0
    return @$container.position().top

  height: (height) ->
    if height != undefined
      @$container.css { height: Math.max(0,height) }

    return @$container.height()
  active: (x) ->
    @activated.dispatch(@)

    

################################################################################
#
# Class: ScrollManager
#
################################################################################
class ScrollManager
  
  scrollTable: []
  scrollValue: 0
  constructor: () ->
    

    _blocks = []
    @blocks = (block) ->
      if block && block instanceof ScrollBlock then _blocks.push block
      else if block then throw new TypeError("expected ScrollBlock object")
      else return _blocks

    _dist = undefined
    @pageDist = (y) ->
      if y != undefined
        x = @scrollTable[y]
        a = @scrollTable.indexOf(x)
        b = @scrollTable.lastIndexOf(x)
        
        if( a != b )
          _dist = y - a
        else
          _dist = undefined
      return _dist

  init:() ->
    
    # wrapp scrollable ellements
    for block in $('#main').find(".scroll-block")
      @blocks new ScrollBlock(block)
   
    @rebuildScrollTable()
    @blockScroll(0)
    
    # add event listners
    $(window).scroll (event) => @onWindowScroll(event)

    # add singal listners
    # for block in @blocks
    # @blocks[0].activated.add (target) => @onActivated()

    return

  rebuildScrollTable: () ->
    @scrollTable = []
    y = 0
    for block in @blocks()
      s = block.scroll()
      h = block.height()
      for i in [1..s]
        @scrollTable.push y
      for i in [1..h]
        @scrollTable.push y - i + 1
      y -= h

    # p = 0
    # for i in @scrollTable
    #  console.log p + ":" + i
    #  p++
    return
  
  render:() ->
    y = @blockScroll()
    for block in @blocks()
      block.top(y,@pageDist())
      y += block.height()
    return

  blockScroll:(y) ->
    if y != undefined
      @scrollValue = y
      @render()
    return @scrollValue

  
  pageScroll:(y) ->
    if y == undefined
      y = $(window).scrollTop()

    if y < 0 || y > @scrollTable.length
      @blockScroll -y
    else
      x = @scrollTable[y]
      @pageDist y
      @blockScroll x
    return

  onWindowScroll:() ->
    @pageScroll $(window).scrollTop()
    return

  onActivated: (e) ->
    # console.log "onActivated"
    # console.log @
    # console.log e


