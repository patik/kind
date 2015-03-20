module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                preserveComments: 'some',
                banner: '/*! @description <%= pkg.description %>\n' +
                    ' * @version <%= pkg.version %>\n' +
                    ' * @date <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' * @copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                    ' * @see <%= pkg.homepage %>\n' +
                    ' */\n'
            },
            build: {
                src: '<%= pkg.main %>.js',
                dest: '<%= pkg.main %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: ['kind.js']
        },
        watch: {
            options: {
                livereload: true,
                interrupt: true
            },
            scripts: {
                files: ['*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                }
            }
        },
        qunit: {
            options: {
                inject: 'test/unit/phantom.js'
            },
            files: 'test/index.html'
        }
    });

    // Default task (JS only)
    grunt.registerTask('default', ['jshint', 'uglify', 'qunit']);

    // Development
    grunt.registerTask('build', ['default', 'watch']);

    // Testing
    grunt.registerTask('test', ['qunit']);
};
