module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
	files: {
	  'public/gen/main.css': 'client/main.scss'
	}
      }
    },
    uglify: {
      dist: {
	files: {
	  'public/gen/app.js': ['public/gen/app.js']
	}
      }
    },
    compress: {
      dist: {
	options: {
	  mode: 'gzip',
	  pretty: true
	},
	expand: true,
	cwd: 'public/',
	src: ['**/*.js', '**/*.html', '**/*.css'],
	dest: 'public_compressed'
      }
    },
    browserify: {
      dist: {
	files: {
	  'public/gen/app.js': ['client/app.js']
	}
      }
    },
    express: {
      dev: {
	options: {
	  script: 'server.js'
	}
      }
    },
    watch: {
      options: {
	livereload: true
      },
      js: {
	files: 'client/**/*.js',
	tasks: ['browserify']
      },
      css: {
	files: 'client/**/*.scss',
	tasks: ['sass']
      },
      express: {
	files: ['server.js', 'public/*.html'],
	tasks: ['express:dev'],
	options: {
	  spawn: false
	}
      }
    },
    aws: grunt.file.readJSON('secrets/aws-keys.json'),
    aws_s3: {
      options: {
	accessKeyId: '<%= aws.s3.key %>',
	secretAccessKey: '<%= aws.s3.secret %>',
	region: 'us-west-2',
	uploadConcurrency: 5,
	downloadConcurrency: 5
      },
      staging: {
	options: {
	  bucket: 'd3-test-staging',
	  differential: true // only upload changes
	},
	files: [
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public_compressed/',
	    src: ['**/*.js', '**/*.html', '**/*.css'],
	    dest: '/',
	    params: {ContentEncoding: 'gzip', CacheControl: 'max-age=5'}
	  },
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public/',
	    src: ['**/*.png', '**/*.jpg'],
	    dest: '/',
	    params: {CacheControl: 'max-age=86400'}
	  },
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public/',
	    src: ['**/*', '!**/*.png', '!**/*.jpg', '!**/*.js', '!**/*.html', '!**/*.css'],
	    dest: '/',
	    params: {CacheControl: 'max-age=5'}
	  }
	]
      },
      production: {
	options: {
	  bucket: 'd3-test',
	  differential: true // only upload changes
	},
	files: [
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public_compressed/',
	    src: ['**/*.js', '**/*.html', '**/*.css'],
	    dest: '/',
	    params: {ContentEncoding: 'gzip', CacheControl: 'max-age=5'}
	  },
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public/',
	    src: ['**/*.png', '**/*.jpg'],
	    dest: '/',
	    params: {CacheControl: 'max-age=86400'}
	  },
	  {
	    'action': 'upload',
	    expand: true,
	    cwd: 'public/',
	    src: ['**/*', '!**/*.png', '!**/*.jpg', '!**/*.js', '!**/*.html', '!**/*.css'],
	    dest: '/',
	    params: {CacheControl: 'max-age=5'}
	  }
	]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.registerTask('default', ['build','express:dev','watch']);
  grunt.registerTask('build', ['browserify', 'sass']);
  grunt.registerTask('stage', ['build', 'uglify', 'compress', 'aws_s3:staging']);
  grunt.registerTask('deploy', ['build', 'uglify', 'compress', 'aws_s3:production']);
};
