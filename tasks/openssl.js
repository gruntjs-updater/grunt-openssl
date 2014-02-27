/*
 * grunt-openssl
 * https://github.com/jdewit/grunt-openssl
 *
 * Copyright (c) 2014 Joris de Wit
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto'),
    fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('openssl', 'Encrypt files with openssl', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      cipher: 'cast5-cbc',
      affix: '.cast5-cbc'
    });

    this.async();

    if (!options.prefix && !options.affix) {
      throw new Error('Prefix or affix must be set');
    }

    this.filesSrc.forEach(function(filepath) {

      if (grunt.option('encrypt')) { // encrypt

        if (options.affix && filepath.match(options.affix)) { // do not encrypt already encrypted files
          return;
        }

        var cipher = crypto.createCipher(options.cipher, grunt.option('encrypt'));

        fs.readFile(filepath, function(err, text) {
          var encrypted = cipher.update(text, 'utf8', 'hex');
          encrypted += cipher.final('hex');
          fs.writeFile(filepath + options.affix, encrypted, {encoding: 'hex'}, function() {
            grunt.log.writeln('Encrypted ' + filepath);
          });
        });

      } else if (grunt.option('decrypt')) { // decrypt

        if (options.affix && !filepath.match(options.affix)) { // do not decode already decoded files
          return;
        }

        var decipher = crypto.createDecipher(options.cipher, grunt.option('decrypt'));
        fs.readFile(filepath, {encoding: 'hex'}, function(err, text) {
          var decrypted = decipher.update(text, 'hex', 'utf8');
          decrypted += decipher.final('utf8');
          fs.writeFile(filepath.replace(options.prefix, '').replace(options.affix, ''), decrypted, function() {
            grunt.log.writeln('Decrypted ' + filepath);
          });

        });

      } else {
          throw new Error('Argument required. See readme.');
      }

    });
  });
};
