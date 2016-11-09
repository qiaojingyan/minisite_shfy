module.exports = function(grunt) {
    // Project configuration.
    grunt.loadTasks('../../../tasks/1.0');
    var mozjpeg = require('imagemin-mozjpeg')
    var _ = require('underscore');

    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),
            repos: grunt.file.readJSON('wowact.json'),
            wowact: {
                options: {
                    basePath: '../../../repos/'
                },
                main: grunt.file.readJSON('wowact.json')
            },
            wowpreload: {
                main: {
                    options: {
                        'baseUrl': '<%= repos.taskConfig.url.server%>'
                    },
                    files: [{ //target
                        cwd: '<%= repos.developDir.srcPath%>',
                        src: '<%= repos.taskConfig.preload.files%>',
                        dest: '<%= repos.developDir.destPath%>'
                    }]
                }

            },
            //目标文件的拷贝
            copy: {
                build: {
                    files: [{ //target
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath%>',
                        src: '<%= repos.taskConfig.copy.files%>',
                        dest: '<%= repos.developDir.destPath%>/'
                    }]
                },
                develop: {
                    files: [{ //dev
                        expand: true,
                        cwd: 'src/',
                        src: '**',
                        dest: '<%= repos.developDir.devPath%>'
                    }]
                },
            },
            /**
             * 使用data-main时就不用配置
             * 如果未使用data-main则需对每个都单独配置
             */
            requirejs: {
                compile: {
                    options: {
                        test: "111",
                        baseUrl: '<%= repos.developDir.devPath%>',
                        include: '<%= repos.taskConfig.requirejs.config %>',
                        mainConfigFile: '<%= repos.developDir.devPath%>/<%= repos.taskConfig.requirejs.config %>',
                        out: '<%= repos.developDir.destPath%>/<%= repos.taskConfig.requirejs.out %>',
                        optimize: 'uglify',
                    }
                }
            },
            //less编译
            less: {
                compile: {
                    files: [{
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath%>',
                        src: '<%= repos.taskConfig.less.files %>',
                        ext: '.css',
                        dest: '<%= repos.developDir.devPath%>'
                    }]
                },
                make: {
                    options: {
                        compress: true
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath%>',
                        src: '<%= repos.taskConfig.less.files %>',
                        ext: '.css',
                        dest: '<%= repos.developDir.destPath%>'
                    }]
                },
            },
            //压缩js
            uglify: {
                options: {
                    mangle: true,
                    debug: true
                },
                my_target: {
                    files: [{
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath%>',
                        src: '<%= repos.taskConfig.uglifyjs.files%>',
                        dest: '<%= repos.developDir.destPath %>'
                    }]
                }
            },
            //生成MD5文件名
            md5: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/',
                        src: '',
                        dest: '<%= repos.developDir.destPath%>'
                    }],
                    options: {
                        encoding: null,
                        keepBasename: true,
                        keepExtension: true,
                        afterEach: function(fileChange, options) {},
                        after: function(fileChanges, options) {

                        }
                    }
                }
            },
            /**
             * 图片压缩,压缩JPG
             * @type {Object}
             */
            imagemin: {
                dynamic: {
                    options: {
                        use: [mozjpeg()]
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath %>',
                        src: '<%= repos.taskConfig.imagemin.jpg %>',
                        dest: '<%= repos.developDir.srcPath %>'
                    }]

                }

            },
            pngmin: { //压缩PNG
                compile: {
                    options: {
                        ext: '.png',
                        force: true //强制覆盖
                    },
                    files: [{
                        expand: true,
                        cwd: '<%= repos.developDir.srcPath %>',
                        src: '<%= repos.taskConfig.imagemin.png %>',
                        dest: '<%= repos.developDir.srcPath %>'
                    }]
                }
            },
            watch: {
                sync: {
                    files: ['<%= repos.developDir.srcPath%>/**', '!<%= repos.developDir.srcPath%>/**/**.less'],
                    tasks: ['sync:main'],
                    options: {
                        nospawn: true,
                        livereload: true
                    }
                },
                sync_src_less: {
                    files: ['<%= repos.developDir.srcPath%>/**/*.less'],
                    tasks: ['sync:main', 'less:compile','autoprefixer:targets1'],
                    options: {
                        nospawn: true,
                        livereload: true
                    }
                }
            },
            connect: {
                dev_tpl_src_server: {
                    options: {
                        port: 9000,
                        livereload: true,
                        // hostname: '',
                        // debug:true,
                        base: ['<%= repos.developDir.devPath%>']
                    }
                }
            },
            sync: {
                main: {
                    files: [{
                        cwd: './src/',
                        src: ['**'],
                        dest: '<%= repos.developDir.devPath%>',
                    }],
                    pretend: false, //Don't do any IO  ?
                    verbose: true //显示LOG
                },
            },
            autoprefixer: {
                options: {
                    // Task-specific options go here. 
                },
                targets: {
                    expand: true,
                    cwd: '<%= repos.developDir.destPath%>',
                    src: '**/*.css',
                    dest: '<%= repos.developDir.destPath%>'
                },
                targets1: {
                    expand: true,
                    cwd: '<%= repos.developDir.devPath%>',
                    src: '**/*.css',
                    dest: '<%= repos.developDir.devPath%>'
                },
            },
            dom_munger: {
                make: {
                    options: {
                        callback: function($) {}
                    },
                    src: '<%= repos.developDir.srcPath%><%= repos.taskConfig.html%>',
                    dest: '<%= repos.developDir.destPath%><%= repos.taskConfig.html %>'
                },
            },

            clean: ['<%= repos.developDir.devPath%>/**', '<%= repos.developDir.destPath%>/**']

        });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-md5');
    grunt.loadNpmTasks('grunt-dom-munger');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-pngmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-autoprefixer');

    //for make dist
    grunt.registerTask('make', ['clean', 'copy', 'wowact', 'less:make', 'requirejs', 'uglify', 'autoprefixer', 'dom_munger']);
    grunt.registerTask('m', ['make']);
    //for tiny image
    grunt.registerTask('img', ['imagemin', 'pngmin']);
    //for developDir
    grunt.registerTask('default', ['copy:develop','less:compile', 'autoprefixer:targets1','connect', 'watch']);
};