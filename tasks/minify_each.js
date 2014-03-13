/*
 * grunt-minify-each
 * https://github.com/y910242/grunt-minify-each
 *
 * Copyright (c) 2014 Joe Acosta
 * Licensed under the GPL license.
 */

'use strict';

var MinifyEach = require("./lib/MinifyEach");

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask(MinifyEach.TASK_NAME, MinifyEach.TASK_DESCRIPTION, function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options, files, minify;

        options = this.options({
            dest: 'build',
            minDest: '',
            sourceFilter: /^src\//,
            copy: true,
            type: 'uglifyjs',
            parameters: ['--max-line-len=10000', '--lift-vars', '-m']
        });
        files = this.files;


        minify = new MinifyEach(this, options, files);
        minify.processFiles();
    });

};
