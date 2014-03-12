# grunt-minify-each

> A grunt plugin to provide a minified version of each file in a source repo

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-minify-each --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-minify-each');
```

## The "minify_each" task

### Overview
In your project's Gruntfile, add a section named `minify_each` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  minify_each: {
    	dest: 'build',
        minDest: '',
        sourceFilter: /^src\//,
        type: 'uglifyjs',
        parameters: ['--max-line-len=10000', '--lift-vars', '-m']
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.dest
Type: `String`
Default value: `build`

The build directory of where the files should be output to.

#### options.sourceFilter
Type: `String`
Default value: /^src\//

If set then it is a filter that is applied to a source file.

#### options.minDest
Type: `String`
Default value: ``

If set to a directory location it will create the minified files in that location. This can be useful when using require as you can change baseUrl in require to switch between minified files and none minified files.

#### options.type
Type: `String`
Default value: `uglifyjs`

The minify engine to use, see node-minify for the options.

#### options.dest
Type: `Array`
Default value: `['--max-line-len=10000', '--lift-vars', '-m']`

Options to pass to the minification engine

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  minify_each: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  minify_each: {
    options: {
      dest: 'build',
        type: 'uglifyjs',
        parameters: ['--max-line-len=10000', '--lift-vars', '-m']
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
