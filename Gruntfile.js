module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  
    concat: {
      options: {
        separator: '\n;\n'
      },
      scripts: {
        src: ['app/**/**.js'],
        dest: 'build/app.js'
      },
      css: {
        src: ['app/**/**.css', 'bower_components/startbootstrap-sb-admin-2/dist/css/sb-admin-2.css'],
        dest: 'build/app.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'build/app.min.js': ['<%= concat.scripts.dest %>'],
        }
      }
    },

    copy: {
      main: {
        files: [
        {
          expand: true,
          cwd: 'app/',
          src: '**/*',
          dest: 'build/'
        },
        {
          expand: true,
          flatten: true,
          src: ['bower_components/bootstrap/dist/css/bootstrap.min.css', 'bower_components/metisMenu/dist/metisMenu.min.css', 'bower_components/ng-table/dist/ng-table.min.css', 'bower_components/startbootstrap-sb-admin-2/dist/css/sb-admin-2.css', 'bower_components/font-awesome/css/font-awesome.min.css',
                'bower_components/angular/angular.min.js', 'bower_components/angular-route/angular-route.min.js', 'bower_components/ng-table/dist/ng-table.min.js', 'bower_components/angular-pouchdb/angular-pouchdb.min.js', 'bower_components/pouchdb/dist/pouchdb.min.js', 'bower_components/pouchdb-authentication/dist/pouchdb.authentication.min.js',
            'bower_components/jquery/dist/jquery.min.js', 'bower_components/bootstrap/dist/js/bootstrap.min.js', 'bower_components/metisMenu/dist/metisMenu.min.js', 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'],
          dest: 'build/lib/'
        },
        {
          expand: true,
          flatten: true,
          src: 'bower_components/**/fonts/*',
          dest: 'build/fonts'
        },
      ]}
    },

    manifest: {
      generate: {
        options: {
          cache: ['fonts/fontawesome-webfont.ttf?v=4.2.0'],
          basePath: './build/',
          headcomment: " <%= pkg.name %> v<%= pkg.version %>",
          verbose: true,
          timestamp: true,
          hash: true,
        },
        src: [
          '**/**.html',
          '**/**.js',
          '**/**.css',
          '**/**.ttf'
        ],
        dest: 'build/manifest.appcache'
      }
    },

  bump: {
    options: {
      files: ['package.json', 'bower.json', 'app/app.js'],
      updateConfigs: [],
      commit: true,
      commitMessage: 'Release v%VERSION%',
      commitFiles: ['package.json'],
      createTag: true,
      tagName: 'v%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: true,
      pushTo: 'origin',
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
      globalReplace: false,
      prereleaseName: false,
      regExp: new RegExp('([\'|\"]?version[\'|\"]?[ ]*[:|,][ ]*[\'|\"]?)(\\d+\\.\\d+\\.\\d+(-<%= bump.options.prereleaseName %>\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)', 'i'),
    }
  },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-bump');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'copy', 'manifest']);

};
