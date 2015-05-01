// YUI compressor engine
var grunt = require( "grunt" ),
    path = require( 'path' ),
    Compressor = require( 'node-minify' );

function MinifyEach( task, options, sources ) {

    var srcReg = new RegExp( "^src" );

    this.task = task;
    this.options = options;
    this.sources = sources;

    this.Defaults = {
        dest: 'build',
        minDest: '',
        sourceFilter: srcReg,
        type: 'uglifyjs',
        parameters: [ '--max-line-len=10000', '--lift-vars', '-m' ]
    };

    this.dest = ( !options || !options.dest ) ? this.Defaults.dest : options.dest;
    this.minDest = ( !options || !options.minDest ) ? this.Defaults.minDest : options.minDest;
    this.type = ( !options || !options.type ) ? this.Defaults.type : options.type;
    this.parameters = ( !options || !options.parameters ) ? this.Defaults.parameters : options.parameters;
    this.sourceFilter = ( !options || !options.sourceFilter ) ? this.Defaults.sourceFilter : options.sourceFilter;
}

MinifyEach.prototype.compress = function ( sourceFile, destFile, type, params ) {

    var comp;

    function errorHandler( error, min ) {

        if ( error ) {
            grunt.log.warn( error, min );
            return;
        }
        grunt.log.writeln( 'File `' + destFile + '` created.' );
        // Let Grunt know the asynchronous task has completed
        return;
    }

    try {
        grunt.log.debug( "Compressor source " + sourceFile );
        grunt.log.debug( "Compressor destination " + destFile );
        comp = new Compressor.minify( {
            'type': type,
            'fileIn': sourceFile,
            'fileOut': destFile,
            'options': params,
            'callback': errorHandler
        } );
    } catch ( e ) {
        grunt.log.error( 'File `' + destFile + '` NOT created. ' + e );
    }
};

MinifyEach.prototype.processFiles = function () {
    var destOut, fname, filter, minFileOut, minDest, dest, type, params, self = this,
        forwardSlash = /\//g;

    dest = path.resolve( this.dest );

    type = this.type;
    params = this.parameters;
    filter = this.sourceFilter;
    minDest = this.minDest;

    destOut = ( dest.charAt[ dest.length - 1 ] === path.sep ) ? dest : dest + path.sep;
    destOut = path.normalize( destOut );

    grunt.log.debug( "Option minDest " + minDest );
    if ( minDest !== '' ) {
        minDest = path.join( dest, minDest );
    }
    grunt.log.debug( "Updated minDest " + minDest );

    // log all the data that we are passing in
    grunt.log.debug( "Options: " + JSON.stringify( {
        'dest': dest,
        'type': type,
        'parameters': params,
        'minDest': minDest,
        'sourceFilter': filter.toString()
    } ) );

    this.sources.forEach( function ( f ) {
        var slen;
        slen = f.src.length;
        f.src.filter( function ( filepath ) {
            var fullPathInFile;
            // don't minify the minified files from previous run
            if ( filepath.indexOf( "min.js" ) === -1 && ( minDest === "" || filepath.indexOf( minDest ) === -1 ) ) {
                grunt.log.debug( "Processing source file " + filepath );

                // filepath is the source file, so we need to figure out dest
                fname = filepath.replace( filter, '' );
                grunt.log.debug( "Filtered name " + fname );

                // resolve correct fname
                fname = fname.replace( forwardSlash, path.sep );
                grunt.log.debug( "OS updated name " + fname );

                // copy source file to destination and update fname
                if ( fname.indexOf( destOut ) === -1 ) {
                    fname = path.join( destOut, fname );
                    grunt.log.debug( "Copy source " + filepath + " to dest " + fname );
                    grunt.file.copy( filepath, fname );
                }

                // create minified dest file
                if ( minDest === '' ) {
                    minFileOut = fname.replace( ".js", "-min.js" );
                    grunt.log.debug( "Generating minified filename " + minFileOut );
                } else {
                    // so minDest is NOT an empty string
                    // so we are sticking in some other directory
                    if ( fname.indexOf( destOut ) !== -1 ) {
                        destOut = path.resolve( destOut );
                        minDest = path.resolve( minDest );
                        fname = fname.replace( destOut, '' );
                        //fname = fname.replace( leadingSlash, '' );
                        minFileOut = path.join( minDest, fname );
                        grunt.log.debug( "The output file will be (f=d)" + minFileOut );
                        if ( minFileOut.indexOf( minDest ) === -1 ) {
                            grunt.log.error( "Weirdness happens! " + minFileOut );
                        }
                    } else if ( fname.indexOf( minDest ) !== -1 ) {
                        // this is wrong and we should not have this
                        // in this case the fname already has the minDest in it
                        // this likely means that input file is in the generated file
                        minFileOut = fname;
                        grunt.log.debug( "The output file will be  (f=m)" + minFileOut );
                    } else {
                        // fname does not have destOut nor does it have minDest
                        minDest = path.resolve( minDest );
                        minFileOut = path.join( minDest, fname );
                        grunt.log.debug( "The output file will be  (f ne)" + minFileOut );
                    }
                }
                fullPathInFile = path.resolve( filepath );
                minFileOut = path.resolve( minFileOut );
                // input file and output files cannot be the same file
                if ( fullPathInFile !== minFileOut ) {
                    grunt.file.mkdir( minFileOut.substring( 0, minFileOut.lastIndexOf( path.sep ) ) );
                    grunt.log.writeln( "Source file : " + filepath + " minified file: " + minFileOut );
                    self.compress( filepath, minFileOut, type, params );
                }
            }
        } );
    } );
};

MinifyEach.TASK_NAME = "minify_each";
MinifyEach.TASK_DESCRIPTION = "Grunt plugin to minify individual files, so that unminified and minified files can be used in an environment";

module.exports = MinifyEach;
