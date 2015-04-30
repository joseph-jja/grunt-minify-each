// YUI compressor engine
var grunt = require("grunt"),
    Compressor = require('node-minify');

function MinifyEach(task, options, sources) {

    this.task = task;
    this.options = options;
    this.sources = sources;

    this.Defaults = {
        dest: 'build',
        minDest: '',
        sourceFilter: /^src\//,
        type: 'uglifyjs',
        parameters: ['--max-line-len=10000', '--lift-vars', '-m']
    };

    this.dest = (!options || !options.dest) ? this.Defaults.dest : options.dest;
    this.minDest = (!options || !options.minDest) ? this.Defaults.minDest : options.minDest;
    this.type = (!options || !options.type) ? this.Defaults.type : options.type;
    this.parameters = (!options || !options.parameters) ? this.Defaults.parameters : options.parameters;
    this.sourceFilter = (!options || !options.sourceFilter) ? this.Defaults.sourceFilter : options.sourceFilter;
}

MinifyEach.prototype.compress = function(sourceFile, destFile, type, params) {

    var comp;

    function errorHandler(error, min) {

        if (error) {
            grunt.log.warn(error, min);
            return;
        }
        grunt.log.writeln('File `' + destFile + '` created.');
        // Let Grunt know the asynchronous task has completed
        return;
    }

    try {
        comp = new Compressor.minify({
            'type': type,
            'fileIn': sourceFile,
            'fileOut': destFile,
            'options': params,
            'callback': errorHandler
        });
    } catch (e) {
        grunt.log.error('File `' + destFile + '` NOT created. ' + e);
    }
};

MinifyEach.prototype.processFiles = function() {
    var destOut, fname, filter, minFileOut, minDest, dest, type, params, self = this;

    dest = this.dest;
    minDest = this.minDest;
    type = this.type;
    params = this.parameters;
    filter = this.sourceFilter;

    destOut = (dest.charAt[dest.length - 1] === "/") ? dest : dest + "/";
    destOut = destOut.replace(/\/\//, "/");
    
    minDest = minDest.replace(/\/\//, "/");

    this.sources.forEach(function(f) {
        var slen;
        slen = f.src.length;
        f.src.filter(function(filepath) {
            // don't minify the minified files from previous run
            if (filepath.indexOf("min.js") === -1 && filepath.indexOf(minDest) === -1) {
                fname = filepath.replace(filter, '');

                // copy source file
                if (fname.indexOf(destOut) === -1) {
                    grunt.file.copy(filepath, destOut + fname);
                }

                // create minified dest file 
                if (minDest === '') {
                    minFileOut = destOut + fname.replace(".js", "-min.js");
                } else {
                    if (fname.indexOf(destOut) !== -1) {
                        minFileOut = fname.replace(destOut, minDest);
                        if ( minFileOut.indexOf(minDest) === -1 ) {
                            grunt.log.writeln("Weirdness happens! " + minFileOut);
                            //minFileOut = minDest + fname;
                        }
                    } else {
                        minFileOut = minDest + fname;
                    }
                    grunt.file.mkdir(minFileOut.substring(0, minFileOut.lastIndexOf("/")));
                }
                if ( fname.indexOf(minDest) === -1 ) {
                    //console.log("xxxx " + fname.indexOf(destOut) + " " + fname + " " + minFileOut);
                    self.compress(fname, minFileOut, type, params);
                }
            }
        });
    });
};

MinifyEach.TASK_NAME = "minify_each";
MinifyEach.TASK_DESCRIPTION = "Grunt plugin to minify individual files, so that unminified and minified files can be used in an environment";

module.exports = MinifyEach;
