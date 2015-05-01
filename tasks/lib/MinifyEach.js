// YUI compressor engine
var grunt = require("grunt"), path = require('path'),
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
        console.log(sourceFile + " " + destFile);
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
    var destOut, fname, filter, minFileOut, minDest, dest, type, params, self = this,
        dedup = new RegExp(path.sep + path.sep), forwardSlash = /\//g;

    dest = path.resolve(this.dest);
    minDest = path.resolve(this.minDest);
    type = this.type;
    params = this.parameters;
    filter = this.sourceFilter;

    destOut = (dest.charAt[dest.length - 1] === path.sep) ? dest : dest + path.sep;
    destOut = destOut.replace(dedup, path.sep);

    minDest = minDest.replace(dedup, path.sep);

    this.sources.forEach(function(f) {
        var slen;
        slen = f.src.length;
        f.src.filter(function(filepath) {
            var outfile;
            // don't minify the minified files from previous run
            if (filepath.indexOf("min.js") === -1 && filepath.indexOf(minDest) === -1) {
                // filepath is the source file, so we need to figure out dest
                fname = filepath.replace(filter, '');

                // resolve correct fname
                fname = fname.replace(forwardSlash, path.sep);

                // copy source file
                if (fname.indexOf(destOut) === -1) {
                    outfile =  path.join(destOut, fname);
                    grunt.log.debug("Copy source " + filepath + " to dest " +  path.join(destOut, fname));
                    grunt.file.copy(filepath, path.join(destOut, fname));
                }

                // create minified dest file 
                if (minDest === '') {
                    // not tested :O
                    minFileOut = path.join(destOut, fname.replace(".js", "-min.js"));
                } else {
                    if (fname.indexOf(destOut) !== -1) {
                        minFileOut = fname.replace(destOut, minDest);
                        if (minFileOut.indexOf(minDest) === -1) {
                            grunt.log.writeln("Weirdness happens! " + minFileOut);
                            //minFileOut = minDest + fname;
                        }
                    } else {
                        minFileOut = path.join(minDest, fname);
                    }
                    grunt.file.mkdir(minFileOut.substring(0, minFileOut.lastIndexOf(path.sep)));
                }
                if (fname.indexOf(minDest) === -1) {
                    //console.log("xxxx " + fname.indexOf(destOut) + " " + fname + " " + minFileOut);
                    self.compress(filepath, minFileOut, type, params);
                }
            }
        });
    });
};

MinifyEach.TASK_NAME = "minify_each";
MinifyEach.TASK_DESCRIPTION = "Grunt plugin to minify individual files, so that unminified and minified files can be used in an environment";

module.exports = MinifyEach;
