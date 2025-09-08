// ESBuild configuration for JavaScript bundling
const esbuild = require('esbuild');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

const buildOptions = {
  entryPoints: ['src/js/main.js'],
  bundle: true,
  outfile: 'assets/js/main.js',
  format: 'iife',
  target: ['es2020'],
  platform: 'browser',
  sourcemap: isDevelopment,
  minify: isProduction,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  external: [],
  loader: {
    '.js': 'js',
    '.ts': 'ts'
  },
  resolveExtensions: ['.js', '.ts'],
  // Handle GSAP imports
  alias: {
    'gsap': path.resolve(__dirname, 'node_modules/gsap/index.js'),
    'gsap/ScrollTrigger': path.resolve(__dirname, 'node_modules/gsap/ScrollTrigger.js'),
    'gsap/TextPlugin': path.resolve(__dirname, 'node_modules/gsap/TextPlugin.js')
  },
  banner: {
    js: '/* Workout Generator - Modern Build */'
  }
};

// Development build with watch mode
if (isDevelopment && process.argv.includes('--watch')) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('👀 Watching for changes...');
  });
} else {
  // Single build
  esbuild.build(buildOptions).then(() => {
    console.log('✅ JavaScript build complete');
  }).catch((error) => {
    console.error('❌ JavaScript build failed:', error);
    process.exit(1);
  });
}

module.exports = buildOptions;