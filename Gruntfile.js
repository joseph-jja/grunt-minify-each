/*
 * grunt-minify-each
 * https://github.com/y910242/grunt-minify-each
 *
 * Copyright (c) 2014 Joe Acosta
 * Licensed under the GPL license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            files: [
                "package.json",
                "Gruntfile.js",
                "tasks/**/*.js",
                "test/**/*.js"
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp', 'coverage', 'logs'],
        },

        jsbeautifier: {
            files: '<%= jshint.files %>'
        },

        // Configuration to be run (and then tested).
        minify_each: {
            default_options: {
                options: {},
                files: {
                    'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
                },
            },
            custom_options: {
                options: {
                    separator: ': ',
                    punctuation: ' !!!',
                },
                files: {
                    'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
                },
            },
        },

        // Unit tests.
        jasmine_node: {
            src: 'tasks/**/**.js',
            projectRoot: ".",
            specFolders: ["./test/"],
            verbose: true,
            options: {
                specNameMatcher: "*_spec*", // load only specs containing specNameMatcher
                requirejs: false,
                forceExit: true,
                jUnit: {
                    report: false,
                    savePath: "./coverage/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            coverage: {
                //collect: ['tasks/**/**.js'],
                report: ['html']
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'jasmine_node']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['clean', 'jsbeautifier', 'jshint', 'jasmine_node']);
};
