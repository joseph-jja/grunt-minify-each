var grunt = require( "grunt" ),
    path = require( "path" ),
    _ = grunt.util._;

describe( "minify each test", function () {

    var MinifyEach = require( "../tasks/lib/MinifyEach" );

    var minify = require( "../tasks/minify_each" );

    var makeMockTask = function ( done ) {
        var o, taskOptions;

        taskOptions = {
            dest: 'build',
            minDest: '',
            type: 'uglifyjs',
            parameters: [ '--max-line-len=10000', '--lift-vars', '-m' ]
        };
        o = {
            files: [ {
                src: grunt.file.expand( {}, "tasks/**/*.js" )
            } ],
            options: function ( defs ) {
                return _.defaults( taskOptions, defs );
            },
            async: function () {
                return done;
            }
        };
        return o;
    };

    var makeMockTaskAlt = function ( done ) {
        var o, taskOptions;

        taskOptions = {
            dest: 'build',
            minDest: 'min',
            type: 'uglifyjs',
            parameters: [ '--max-line-len=10000', '--lift-vars', '-m' ]
        };
        o = {
            files: [ {
                src: grunt.file.expand( {}, "tasks/**/*.js" )
            } ],
            options: function ( defs ) {
                return _.defaults( taskOptions, defs );
            },
            async: function () {
                return done;
            }
        };
        return o;
    };
    it( "test node require includes", function () {

        expect( minify ).toNotEqual( undefined );
        expect( MinifyEach ).toNotEqual( undefined );

    } );

    it( "registers itself with grunt", function () {

        minify( grunt );

        // Check that it registered
        expect( grunt.task._tasks[ MinifyEach.TASK_NAME ] ).not.toEqual( undefined );
        expect( grunt.task._tasks[ MinifyEach.TASK_NAME ].info ).toEqual( MinifyEach.TASK_DESCRIPTION );
    } );

    it( "loads options from a task", function () {
        var mock, task, files, actual;

        mock = makeMockTask();
        task = new MinifyEach( mock, mock.options(), mock.files );
        actual = task.options;

        expect( actual ).toNotEqual( undefined );
        expect( actual.engine ).toEqual( task.Defaults.engine );
    } );

    it( "run MinifyEach for -min files", function ( done ) {
        var mock, files, task, minFile;

        mock = makeMockTask();
        console.error( mock.files );
        task = new MinifyEach( mock, mock.options(), mock.files );

        spyOn( task, 'processFiles' ).andCallThrough();
        task.processFiles();
        expect( task.processFiles ).toHaveBeenCalled();
        setTimeout( function () {
            minFile = grunt.file.exists( path.resolve( 'build/tasks/lib/MinifyEach-min.js' ) );
            console.log( path.resolve( 'build/tasks/lib/MinifyEach-min.js' ) );
            done();
            expect( minFile ).toBe( true );
        }, 1000 );
    } );

    it( "run MinifyEach for min directory", function ( done ) {
        var mock, files, task, minFile;

        mock = makeMockTaskAlt();
        console.error( mock.files );
        task = new MinifyEach( mock, mock.options(), mock.files );

        spyOn( task, 'processFiles' ).andCallThrough();
        task.processFiles();
        expect( task.processFiles ).toHaveBeenCalled();
        setTimeout( function () {
            minFile = grunt.file.exists( path.resolve( 'build/min/tasks/lib/MinifyEach.js' ) );
            console.log( minFile );
            done();
            expect( minFile ).toEqual( true );
        }, 1000 );
    } );
} );
