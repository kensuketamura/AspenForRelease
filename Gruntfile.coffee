'use strict'

# Load required Node.js modules
path = require 'path'

# Load LiveReload snippet
lrUtils = require 'grunt-contrib-livereload/lib/utils'
lrSnippet = lrUtils.livereloadSnippet

# Helper function for LiveReload
folderMount = (connect, point) ->
  return connect.static path.resolve(point)


#
# Grunt main configuration
# ------------------------
module.exports = (grunt) ->

  #
  # Initial configuration object for Grunt
  # passed to `grunt.initConfig()`
  #
  conf =

    # Setup basic paths and read them by `<%= path.PROP %>`
    path:
      source: 'rawClientSrc'
      publish: 'public'
      views: 'app/views'

    #
    # Task to remove files & directories
    #
    # * [grunt-contrib-clean](https://github.com/gruntjs/grunt-contrib-clean)
    #
    clean:
      options:
        force: true
      publish:
        src: ['<%= path.publish %>', '<%= path.views %>']

    #
    # Task to launch Connect & LiveReload static web server
    #
    # * [grunt-contrib-connect]
    # (https://github.com/gruntjs/grunt-contrib-connect)
    # * [grunt-contrib-livereload]
    # (https://github.com/gruntjs/grunt-contrib-livereload)
    #
    connect:
      publish:
        options:
          port: 50000
          middleware: (connect, options) ->
            return [lrSnippet, folderMount(connect, 'dist')]

    #
    # Task to copy files
    #
    # * [grunt-contrib-copy](https://github.com/gruntjs/grunt-contrib-copy)
    #
    copy:
      source:
        expand: true
        cwd: '<%= path.source %>'
        src: [
          '**/*'
          '!**/*.coffee'
          '!**/*.jade'
          '!**/*.ts'
          '!**/*.jst'
          '!**/*.less'
          '!**/*.litcoffee'
          '!**/*.sass'
          '!**/*.scss'
          '!**/*.styl'
        ]
        dest: '<%= path.publish %>'
      ,
      jade:
        expand: true
        cwd: '<%= path.source %>'
        src: [
          '**/*.jade'
        ]
        dest: '<%= path.views %>'

    jshint:
      option:
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals:
          jQuery: true
      files:[
        '<%= path.source %>/**/*.js'
        '!<%= path.source %>/**/*.min.js'
      ]

    coffeelint:
      app:
        files:
          src:['Gruntfile.coffee']

    typescript:
      base:
        src: ['rawClientSrc/**/*.ts']
        dest: '<%= path.publish %>'
        options: {
          basePath: "<%= path.source %>"
        }
    #
    # Task to compile Jade
    #
    # * [grunt-contrib-jade](https://github.com/gruntjs/grunt-contrib-jade)
    #
    jade:
      options:
        pretty: true
        data: grunt.file.readJSON 'packagecli.json'
      source:
        expand: true
        cwd: '<%= path.source %>'
        src: '**/*.jade'
        dest: '<%= path.publish %>'
        ext: '.html'

    #
    # Task to observe file changes & fire up related tasks
    #
    # * [grunt-regarde](https://github.com/yeoman/grunt-regarde)
    #
    regarde:
      source:
        files: [
          '<%= path.source %>/**/*'
          'packagecli.json'
        ]
        tasks: [
          'default'
          'livereload'
        ]

    watch:
      script:
        files: '<%= path.source %>/**/*'
        tasks: ['default']
        options:
          livereload: true
          spawn: false
      gruntfile:
        files: 'Gruntfile.coffee'
        tasks: ['coffeelint']
      typescript:
        files: '**/*.ts'
        tasks: ['typescript']
      jade:
        files: '**/*.jade'
        tasks: ['html']
      jshint:
        files: '<%= path.source %>/js/*.js'
        tasks: ['jshint']

  #
  # List of sequential tasks
  # passed to `grunt.registerTask tasks.TASK`
  #
  tasks =
    html: [
      'jade'
    ]
    wa: [
      'connect'
      # S'livereload-start'
      'watch'

    ]
    default: [
      'copy:source', 'copy:jade'
    ]


  # Load Grunt plugins
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-livereload'
  grunt.loadNpmTasks 'grunt-regarde'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-typescript'

  # Load initial configuration being set up above
  grunt.initConfig conf

  # Regist sequential tasks being listed above
  grunt.registerTask 'html', tasks.html
  grunt.registerTask 'wa', tasks.wa
  grunt.registerTask 'default', tasks.default
