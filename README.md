# grunt-openssl

> Encrypt/decrypt files with <a href="https://www.openssl.org/docs/apps/openssl.html">openssl</a>

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-openssl --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-openssl');
```

## The "openssl" task

### Config 

```js
grunt.initConfig({
  options: {
    cipher: 'cast5-cbc', # optional
    prefix: '', # optional
    affix: '.cast5-cbc' # optional
  },
  openssl: {
    myConfigs: ['path/configs/*.yml*'] 
  }
});
```

### Usage

$ grunt openssl --encrypt=yourPassword

$ grunt openssl --decrypt=yourPassword
