var grunt = require( "grunt" ),
    _ = grunt.util._;

describe( "minify each test", function () {

    var MinifyEach = require( "../tasks/lib/MinifyEach" );

    var minify = require( "../tasks/minify_each" );

    var makeMockTask = function ( done ) {
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
            type: 'uglifyjs',
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
        expect( grunt.task._tasks[ MinifyEach.TASK_NAME ] ).toNotEqual( undefined );
        expect( grunt.task._tasks[ MinifyEach.TASK_NAME ].info ).toEqual( MinifyEach.TASK_DESCRIPTION );
    } );

    it( "loads options from a task", function () {
        var mock, task, files, actual;

        mock = makeMockTask();
        task = new MinifyEach( mock, mock, mock.files );
        actual = task.options;

        expect( actual ).toNotEqual( undefined );
        expect( actual.engine ).toEqual( task.Defaults.engine );
    } );

    it( "run MinifyEach ", function () {
        var mock, files, task;

        mock = makeMockTask();
        console.error( mock.files );
        task = new MinifyEach( mock, mock, mock.files );

        spyOn( task, 'processFiles' ).andCallThrough();
        task.processFiles();
        expect( task.processFiles ).toHaveBeenCalled();

    } );
} );
