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
                    ' * <%= pkg.homepage %>\n' +
                    ' */\n'
            },
            build: {
                src: '<%= pkg.name %>.js',
                dest: '<%= pkg.name %>.min.js'
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
            },
            docs: {
                files: ['README.md'],
                tasks: ['markdown'],
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
        },

        // Compile markdown files into HTML (e.g. for documentation)
        // https://github.com/treasonx/grunt-markdown
        markdown: {
            options: {
                highlight: 'auto',
                template: 'docs/template.html',
                markdownOptions: {
                    highlight: 'auto',
                    gfm: true,
                }
            },
            prod: {
                files: [{
                    expand: true,
                    src: 'README.md',
                    dest: '',
                    ext: '.html',

                    // Rename "readme" to "index"
                    rename: function (dest, src) {
                        return src.replace('README', 'index');
                    },
                }]
            }
        }
    });

    // Default task (JS only)
    grunt.registerTask('default', ['jshint', 'uglify', 'qunit']);

    // Development
    grunt.registerTask('dev', ['default', 'watch']);

    // Testing
    grunt.registerTask('test', ['qunit']);

    // Documentation
    grunt.registerTask('docs', ['markdown', 'watch']);
};
