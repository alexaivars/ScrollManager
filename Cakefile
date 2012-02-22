fs      = require 'fs'
{exec}  = require 'child_process'
util    = require 'util'
uglify  = require './node_modules/uglify-js'

prodSrcCoffeeDir     = 'src/coffeescript'
specSrcCoffeeDir     = 'spec/coffeescript'

specTargetJsDir      = 'spec/javascripts'
testTargetJsDir      = 'src/javascript'
prodTargetJsDir      = 'public_html/js'

prodTargetFileName   = 'script'
prodTargetCoffeeFile = "#{prodSrcCoffeeDir}/#{prodTargetFileName}.coffee"
prodTargetJsFile     = "#{prodTargetJsDir}/#{prodTargetFileName}.js"
prodTargetJsMinFile  = "#{prodTargetJsDir}/#{prodTargetFileName}.min.js"

prodCoffeeOpts = "--output #{prodTargetJsDir} --compile #{prodTargetCoffeeFile}"
specCoffeeOpts = "--output #{specTargetJsDir}"
testCoffeeOpts = "--bare --output #{testTargetJsDir}"


prodCoffeeFiles = [
  'ScrollManager'
  'DocumentReady'
]



################################################################################
#
#
#
################################################################################
task 'run:test','Run test specs', ->
    util.log 'Running test specs'
    exec 'jasmine-headless-webkit', (err, stdout, stderr) ->
        handleError(err) if err
        util.log stdout
        displayNotification "Test complete"


################################################################################
#
#
#
################################################################################
task 'build:dest', 'Build a single JavaScript file from prod files', ->
    # util.log "Building #{prodTargetJsFile}"
    appContents = new Array remaining = prodCoffeeFiles.length
    # util.log "Appending #{prodCoffeeFiles.length} files to #{prodTargetCoffeeFile}"
    
    for file, index in prodCoffeeFiles then do (file, index) ->
        fs.readFile "#{prodSrcCoffeeDir}/#{file}.coffee"
                  , 'utf8'
                  , (err, fileContents) ->
            handleError(err) if err
            
            appContents[index] = fileContents
            util.log "[#{index + 1}] #{file}.coffee"
            process() if --remaining is 0

    process = ->
        fs.writeFile prodTargetCoffeeFile
                   , appContents.join('\n\n')
                   , 'utf8'
                   , (err) ->
            handleError(err) if err
            
            exec "coffee #{prodCoffeeOpts}", (err, stdout, stderr) ->
                handleError(err) if err
                message = "Compiled #{prodTargetJsFile}"
                util.log message
                displayNotification message
                fs.unlink prodTargetCoffeeFile, (err) -> handleError(err) if err
                invoke 'minify'


################################################################################
#
#
#
################################################################################
task 'build:source', 'Build individual javascript source files', ->
    fs.readdir prodSrcCoffeeDir, (err, files) ->
        handleError(err) if err
        for file, index in prodCoffeeFiles then do (file, index) ->
            if file != "DocumentReady"
                # util.log "Building #{testTargetJsDir}/#{file}.js source files"
                coffee testCoffeeOpts, "#{prodSrcCoffeeDir}/#{file}.coffee"


################################################################################
#
#
#
################################################################################
task 'build:test', 'Build individual test specs', ->
    # util.log 'Building test specs'
    fs.readdir specSrcCoffeeDir, (err, files) ->
        handleError(err) if err
        for file in files then do (file) ->
            if file.match(/\.coffee$/)
                coffee specCoffeeOpts, "#{specSrcCoffeeDir}/#{file}"


################################################################################
#
#
#
################################################################################
task 'build', 'Build and test project', ->
  invoke 'build:dest'
  invoke 'build:source'
  invoke 'build:test'


################################################################################
#
#
#
################################################################################
task 'minify', 'Minify', ->
    jsp = uglify.parser
    pro = uglify.uglify

    fs.readFile prodTargetJsFile, 'utf8', (err, fileContents) ->
        ast = jsp.parse fileContents  # parse code and get the initial AST
        # ast = pro.ast_mangle ast      # get a new AST with mangled names
        ast = pro.ast_squeeze ast     # get an AST with compression optimizations
        final_code = pro.gen_code ast # compressed code here
    
        fs.writeFile prodTargetJsMinFile, final_code
        # fs.unlink prodTargetJsFile, (err) -> handleError(err) if err
        
        message = "Uglified #{prodTargetJsMinFile}"
        # util.log message
        displayNotification message


################################################################################
#
#
#
################################################################################
coffee = (options = "", file) ->
    # util.log "Compiling #{file}"
    exec "coffee #{options} --compile #{file}", (err, stdout, stderr) ->
        handleError(err) if err
        displayNotification "#{file}"


################################################################################
#
#
#
################################################################################
handleError = (error) ->
    util.log error
    displayNotification error


################################################################################
#
#
#
################################################################################
displayNotification = (message = '') ->
    options = {
        title: 'CoffeeScript'
        image: 'lib/CoffeeScript.png'
    }
    try require('./node_modules/growl').notify message, options

###
#
# nead to work out how to watch for new files, removed files.
# unitill then using old rakefile for task watching
#

task 'watch', 'Watch prod source files and build changes', ->
    invoke 'build:source'
    invoke 'build'
    util.log "Watching for changes in #{prodSrcCoffeeDir}"

    for file in prodCoffeeFiles then do (file) ->
        fs.watchFile "#{prodSrcCoffeeDir}/#{file}.coffee", (curr, prev) ->
            if +curr.mtime isnt +prev.mtime
                util.log "Saw change in #{prodSrcCoffeeDir}/#{file}.coffee"
                invoke 'build:source'
                invoke 'build'

task 'watch:all', 'Watch production and test CoffeeScript', ->
    invoke 'watch'
    invoke 'watch:test'
    
task 'watch:test', 'Watch test specs and build changes', ->
    invoke 'build:test'
    util.log "Watching for changes in #{specSrcCoffeeDir}"
    
    fs.readdir specSrcCoffeeDir, (err, files) ->
        handleError(err) if err
        for file in files then do (file) ->
            fs.watchFile "#{specSrcCoffeeDir}/#{file}", (curr, prev) ->
                if +curr.mtime isnt +prev.mtime
                    util.log "Saw change in #{specSrcCoffeeDir}/#{file}"
                    invoke 'build:test'



task 'build:all', 'Build production and test CoffeeScript', ->
    invoke 'build:source'
    invoke 'build:test'
    invoke 'build'




###
