# Development Environment Setup

This document outlines the modern development environment setup for the Workout Generator modernization project.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PHP (v7.4 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Build assets
npm run build

# Start development server
npm run dev
# OR use the batch file on Windows
start-dev.bat
```

## 📁 Project Structure

```
/
├── src/                          # Source files
│   ├── css/
│   │   └── input.css            # Tailwind CSS input file
│   └── js/
│       ├── main.js              # Main JavaScript entry point
│       ├── components/          # JavaScript components
│       │   └── AnimationController.js
│       └── utils/               # Utility functions
│           └── gsap-config.js   # GSAP configuration
├── assets/                      # Built assets (generated)
│   ├── css/
│   │   └── tailwind.css        # Compiled Tailwind CSS
│   └── js/
│       └── main.js             # Bundled JavaScript
├── *.php                       # PHP files (existing)
└── config files                # Build configuration
```

## 🛠 Build Tools

### Tailwind CSS
- **Input**: `src/css/input.css`
- **Output**: `assets/css/tailwind.css`
- **Features**: 
  - Custom fitness theme colors
  - Dark mode defaults
  - Glassmorphism effects
  - Animation utilities

### GSAP (GreenSock)
- **Version**: 3.12.0
- **Features**:
  - Lazy loading configuration
  - Performance optimization
  - Mobile-friendly animations
  - Reduced motion support

### ESBuild
- **Input**: `src/js/main.js`
- **Output**: `assets/js/main.js`
- **Features**:
  - Fast bundling
  - ES2020 target
  - Source maps in development
  - Minification in production

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development with hot reload
npm run watch:css    # Watch CSS changes
npm run watch:js     # Watch JavaScript changes
npm run serve        # Start live server

# Building
npm run build        # Build all assets
npm run build:css    # Build CSS only
npm run build:js     # Build JavaScript only
```

## 🎨 Theme Configuration

### Color Palette
- **Primary Blue**: `#00D4FF` - Electric blue for primary actions
- **Secondary Green**: `#39FF7A` - Neon green for success states
- **Accent Orange**: `#FF6B35` - Warm orange for highlights
- **Background**: `#0B1426` - Dark main background
- **Cards**: `#1A2332` - Elevated card background

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Animations
- **Duration**: 300-600ms for most transitions
- **Easing**: power2.out, elastic.out, bounce.out
- **Performance**: 60fps target with mobile optimization

## 🔧 Configuration Files

### `tailwind.config.js`
- Custom color palette
- Dark mode configuration
- Animation keyframes
- Component utilities

### `esbuild.config.js`
- JavaScript bundling configuration
- GSAP alias setup
- Development/production modes

### `package.json`
- Dependencies and scripts
- Build pipeline configuration

## 🚦 Development Workflow

1. **Start Development**:
   ```bash
   npm run dev
   ```

2. **Make Changes**:
   - Edit CSS in `src/css/input.css`
   - Edit JavaScript in `src/js/`
   - PHP files are served directly

3. **View Changes**:
   - CSS/JS changes auto-rebuild
   - Refresh browser to see updates
   - PHP changes are immediate

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📱 Mobile Development

- Responsive design with mobile-first approach
- Touch-friendly interactions
- Performance optimization for mobile devices
- Battery-efficient animations

## ♿ Accessibility Features

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion preference respect
- High contrast mode support

## 🔍 Debugging

### Development Tools
- Source maps enabled in development
- Console logging for animation states
- Performance monitoring
- Error boundaries for graceful degradation

### Common Issues
- **GSAP not loading**: Check network tab, fallback to CSS animations
- **Animations stuttering**: Enable performance mode, reduce complexity
- **CSS not updating**: Clear browser cache, check build process

## 📈 Performance Optimization

### CSS
- Minified output
- Unused CSS purging
- Critical CSS inlining (future enhancement)

### JavaScript
- Tree shaking with ESBuild
- Lazy loading for GSAP plugins
- Performance monitoring
- Memory leak prevention

### Images
- Responsive image loading (future enhancement)
- WebP format support (future enhancement)
- Lazy loading implementation (future enhancement)

## 🔄 Hot Reload

The development environment supports hot reload for:
- ✅ CSS changes (Tailwind compilation)
- ✅ JavaScript changes (ESBuild bundling)
- ✅ PHP file changes (server restart)
- ✅ Configuration changes

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf assets/css assets/js
npm run build
```

### PHP Server Issues
```bash
# Check PHP version
php --version

# Start PHP server manually
php -S localhost:8000
```

### Port Conflicts
- PHP server: Change port in start-dev.bat
- Live server: Modify dev-server.js configuration

## 🚀 Next Steps

After completing the development environment setup:

1. ✅ Task 1: Development environment (COMPLETED)
2. ⏳ Task 2: Component architecture setup
3. ⏳ Task 3: Landing page transformation
4. ⏳ Task 4: Multi-step form wizard
5. ⏳ Task 5: Enhanced results display

## 📞 Support

For development environment issues:
1. Check this documentation
2. Review console errors
3. Verify all dependencies are installed
4. Ensure PHP and Node.js versions are compatible