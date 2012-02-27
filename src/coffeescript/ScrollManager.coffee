###
* TERMS OF USE - SCROLL MANAGER
* 
* Open source under the BSD License. 
* 
* Copyright © 2012 Alexander Aivars
* All rights reserved.
*  
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
*   Redistributions of source code must retain the above copyright notice, this list of 
*   conditions and the following disclaimer.
*
*   Redistributions in binary form must reproduce the above copyright notice, this list 
*   of conditions and the following disclaimer in the documentation and/or other materials 
*   provided with the distribution.
*
*   Neither the name of the author nor the names of contributors may be used to endorse 
*   or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE. 
###

################################################################################
#
# Utils
#
################################################################################
## Make sure we use our preffered jQuery short hand.
$ = jQuery

## Because we are lazy and like to console log.
window.console ?=
  log:->
    return

## Mostly for our IE users
## https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
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

## Mostly for our IE users
## https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
unless Array::indexOf
  Array::indexOf = (searchElement) ->
    "use strict"
    throw new TypeError()  unless this?
    t = Object(this)
    len = t.length >>> 0
    return -1  if len is 0
    n = 0
    if arguments.length > 0
      n = Number(arguments[1])
      unless n is n
        n = 0
      else n = (n > 0 or -1) * Math.floor(Math.abs(n))  if n isnt 0 and n isnt Infinity and n isnt -Infinity
    return -1  if n >= len
    k = (if n >= 0 then n else Math.max(len - Math.abs(n), 0))
    while k < len
      return k  if k of t and t[k] is searchElement
      k++
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
      # width:@$container.width()
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
      if o != undefined
        @transition o / @scroll()
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
  
  @ALIGN_CENTER: "center"
  @ALIGN_TOP: "top"
  @WINDOW_HEIGHT: -1

  scrollTable: undefined
  scrollValue: undefined
  options: undefined

  constructor: (options) ->
    @options =
      align: ScrollManager.ALIGN_TOP
      debug: false

    for index of @options
      @options[index] = options[index]  if options and typeof options[index] isnt "undefined"

    ScrollManager.WINDOW_HEIGHT = $(window).height()
    _container = undefined
    @container = () ->
      if _container == undefined
        _container = $("<div class='scroll-manager'></div>")
        _container.css({
          height: ScrollManager.WINDOW_HEIGHT
        })
        _container.appendTo( $('body') )
      return _container

    _blocks = []
    @blocks = (block) ->
      if block && block instanceof ScrollBlock
        _blocks.push block
        block.$container.appendTo( @container() )
        @setHeight()
      else if block then throw new TypeError("expected ScrollBlock object")
      else return _blocks

    _dist = undefined
    @pageDist = (y) ->
      if y != undefined
        x = @scrollTable[y]
        a = @scrollTable.indexOf(x)
        b = @scrollTable.lastIndexOf(x)
        # console.log y + ":" + x + ":" + a + ":" + b
        if( a != b )
          _dist = y - a
        else
          _dist = undefined
      return _dist

  init:() ->
    
    # wrapp scrollable ellements
    for block in $('#main').find(".scroll-block")
      @blocks new ScrollBlock(block)
   
    
    # add event listners
    $(window).scroll (event) => @onWindowScroll(event)
    $(window).resize (event) => @onWindowResize(event)
    $(window).resize()
    # add singal listners
    # for block in @blocks
    # @blocks[0].activated.add (target) => @onActivated()

    return
  setHeight: () ->
    _height = 0
    for block in @blocks()
      _height += block.height() + block.scroll()
    _height -= @blocks()[@blocks().length - 1].height() if @blocks()[@blocks().length - 1]
    _height += ScrollManager.WINDOW_HEIGHT
    @container().height( _height )

  rebuildScrollTable: () ->
    if @options.align == ScrollManager.ALIGN_CENTER
      @scrollTable = []
      y = Math.round( ScrollManager.WINDOW_HEIGHT * 0.5 )
      f = true
      for block in @blocks()
        s = block.scroll()
        h = block.height() * 0.5
        if f != true then for i in [1..h]
          @scrollTable.push y - i + 1
          # console.log "I" + (@scrollTable.length - 1) + ":" + @scrollTable[ @scrollTable.length - 1]
        for i in [1..s]
          @scrollTable.push y - h
          # console.log "S" + (@scrollTable.length - 1) + ":" + @scrollTable[ @scrollTable.length - 1]
        for i in [1..h]
          @scrollTable.push y - i + 1 - h
          # console.log "O" + (@scrollTable.length - 1) + ":" + @scrollTable[ @scrollTable.length - 1]
        y -= h * 2
        f = false
        
      # for i,n in @scrollTable
      #  console.log n + ":" + i
    else
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
    y = @scrollValue
    c = Math.round( ScrollManager.WINDOW_HEIGHT * 0.5 )

    if @options.align == ScrollManager.ALIGN_CENTER
      for block in @blocks()
        if y < c - block.height() * 0.5
          block.top(y,block.scroll())
        else if y == c - block.height() * 0.5
          block.top(y,@pageDist())
        else
          block.top(y,0)
        y += block.height()
    else
      for block in @blocks()
        if y < 0
          block.top(y,block.scroll())
        else if y == 0
          block.top(y,@pageDist())
        else
          block.top(y,0)
        y += block.height()

    return
  
  pageScroll:(y) ->
    if y == undefined
      y = $(window).scrollTop()
    
    y = Math.max( 0, y )
    if y < 0 || y > @scrollTable.length
      @scrollValue = -y
    else
      x = @scrollTable[y]
      @scrollValue =  x
    
    @pageDist y
    @render()
    return

  onWindowScroll:() ->
    @pageScroll $(window).scrollTop()
    return

  onWindowResize:() ->
    ScrollManager.WINDOW_HEIGHT = $(window).height()
    @container().width( $(window).width() )
    @setHeight()
    @rebuildScrollTable()
    @pageScroll $(window).scrollTop()
    return

  onActivated: (e) ->
    # console.log "onActivated"
    # console.log @
    # console.log e


