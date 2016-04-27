module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //uglify config
        uglify: {
            options: {
                banner:'/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'min/<%= pkg.name %>.min.js': ['src/js/*.js'],
                    'min/withDefaultImplementations/<%= pkg.name %>.min.js' : ['src/js/*.js','src/js/defaultImplementations/**/*.js']
                }
            }
        },

        //concat options for debug / non uglified file
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            basic: {
                src: ['src/js/*.js'],
                dest: 'dist/<%= pkg.version %>/<%= pkg.name %>.js'
            },
            extras: {
                src: ['src/js/*', 'src/js/defaultImplementations/**'],
                dest: 'dist/<%= pkg.version %>/withDefaultImplementations/<%= pkg.name %>.js'
            }
        },

        //jshint,files to check
        jshint: {
            all: ['Gruntfile.js', 'src/js/*.js','src/js/defaultImplementations/**/*.js' ,'specs/*.js']
        },

        //test specs
        jasmine : {
            src : ['lib/*.js','src/js/*.js','specs/**/*.js','src/js/defaultImplementations/**/*.js'],
            options : {
                specs : 'specs'
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('test', ['jshint','jasmine']);
    grunt.registerTask('default', ['concat','uglify']);

};
