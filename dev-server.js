// Development server configuration for hot reload
const liveServer = require('live-server');
const path = require('path');

const params = {
  port: 3000,
  host: "localhost",
  root: path.resolve(__dirname),
  open: true,
  file: "index.php",
  wait: 1000,
  mount: [
    ['/assets', './assets'],
    ['/src', './src']
  ],
  logLevel: 2,
  middleware: [
    function(req, res, next) {
      // Add CORS headers for development
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Handle PHP files (basic simulation for development)
      if (req.url.endsWith('.php')) {
        console.log(`📄 PHP request: ${req.url}`);
      }
      
      next();
    }
  ]
};

// Start the development server
liveServer.start(params);

console.log(`
🚀 Development server started!
📍 Local: http://localhost:3000
📁 Root: ${params.root}
🔄 Hot reload enabled
📝 Watching: *.php, *.css, *.js files

Note: For full PHP functionality, use a local PHP server:
php -S localhost:8000
`);

module.exports = params;