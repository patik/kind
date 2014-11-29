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
                },
                // Add a CSS file to the pages
                // postCompile: function(html, context) {
                //     var x = '', i;

                //     for (i in context) {
                //         // if (context.hasOwnProperty(i)) {
                //             x += context[i] + '\n';
                //         // }
                //     }

                //     return html.replace('<title>doc</title>', '<title>Kind, the precise type-checker for JavaScript</title>\n' +
                //                 '<meta name="viewport" content="width=device-width,initial-scale=1">' +
                //                 '<meta name="author" content="Craig Patik">' +
                //                 '<link rel="canonical" href="http://patik.github.io/kind">'
                //                 ) + '<link href="docs/github-markdown.css" rel="stylesheet"><div>' + x + '</div>';
                // },
            },
            prod: {
                files: [{
                    expand: true,
                    src: 'README.md',
                    dest: '',
                    ext: '.html',

                    // This plugin has a bug making it impossible to put the files where we want them, so we rename the path that Grunt generates to move the file
                    // See: https://github.com/treasonx/grunt-markdown/issues/43
                    rename: function (dest, src) {
                        // Rename the readme
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
};
