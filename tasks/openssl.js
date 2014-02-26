/*
 * grunt-openssl
 * https://github.com/jdewit/grunt-openssl
 *
 * Copyright (c) 2014 Joris de Wit
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('openssl', 'Encrypt files with openssl', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      cipher: 'cast5-cbc',
      prefix: '',
      affix: '.cast5-cbc'
    });

    var cb = this.async();
    var cmd;
    var log;

    if (!options.prefix && !options.affix) {
      throw new Error('Prefix or affix must be set');
    }

    this.filesSrc.forEach(function(filepath) {

      if (grunt.option('encrypt')) {
        if ((options.prefix && filepath.match(options.prefix)) || (options.affix && filepath.match(options.affix))) {
          return;
        }

        cmd = 'openssl ' + options.cipher + ' -e -in ' + filepath + ' -out ' + options.prefix + filepath + options.affix;
        log = 'Encrypting ' + filepath;
      } else if (grunt.option('decrypt')) {
        if ((options.prefix && !filepath.match(options.prefix)) || (options.affix && !filepath.match(options.affix))) {
          return;
        }
        cmd = 'openssl ' + options.cipher + ' -d -in ' + filepath + ' -out ' + filepath.replace(options.prefix, '').replace(options.affix, '');
        log = 'Decrypting ' + filepath;
      } else {
          throw new Error('Argument required.');
      }

      var cp = exec(cmd, {stdin: true, stdout: true}, function (err, stdout, stderr) {
        if (err && options.failOnError) {
          grunt.warn(err);
        }
        cb();
      }.bind(this));

      var captureOutput = function (child, output) {
        child.on('data', function (data) {
          output.write(data);
        });
      };

      captureOutput(cp.stdout, process.stdout);

      captureOutput(cp.stderr, process.stderr);

      process.stdin.resume();
			process.stdin.setEncoding('utf8');
			process.stdin.pipe(cp.stdin);

      grunt.log.writeln(log);
    });
  });
};
