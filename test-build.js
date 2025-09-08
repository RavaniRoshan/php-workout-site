// Test script to verify the build environment is working correctly
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Workout Generator Build Environment...\n');

// Test 1: Check if required files exist
const requiredFiles = [
  'package.json',
  'tailwind.config.js',
  'src/css/input.css',
  'src/js/main.js',
  'src/js/components/AnimationController.js',
  'src/js/utils/gsap-config.js',
  'assets/css/tailwind.css',
  'assets/js/main.js'
];

let allFilesExist = true;
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Test 2: Check if built CSS contains expected classes
console.log('\n🎨 Checking CSS build:');
try {
  const cssContent = fs.readFileSync('assets/css/tailwind.css', 'utf8');
  const expectedClasses = ['.btn-primary', '.btn-secondary', '.input-field', '.gsap-fade-in'];
  
  expectedClasses.forEach(className => {
    const exists = cssContent.includes(className);
    console.log(`  ${exists ? '✅' : '❌'} ${className} class`);
    if (!exists) allFilesExist = false;
  });
  
  console.log(`  📊 CSS file size: ${Math.round(cssContent.length / 1024)}KB`);
} catch (error) {
  console.log('  ❌ Failed to read CSS file');
  allFilesExist = false;
}

// Test 3: Check if built JS contains expected components
console.log('\n⚡ Checking JavaScript build:');
try {
  const jsContent = fs.readFileSync('assets/js/main.js', 'utf8');
  const expectedComponents = ['AnimationController', 'WorkoutApp', 'gsap'];
  
  expectedComponents.forEach(component => {
    const exists = jsContent.includes(component);
    console.log(`  ${exists ? '✅' : '❌'} ${component} component`);
    if (!exists) allFilesExist = false;
  });
  
  console.log(`  📊 JS file size: ${Math.round(jsContent.length / 1024)}KB`);
} catch (error) {
  console.log('  ❌ Failed to read JS file');
  allFilesExist = false;
}

// Test 4: Check package.json scripts
console.log('\n📜 Checking npm scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const expectedScripts = ['dev', 'build', 'build:css', 'build:js', 'watch:css'];
  
  expectedScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    console.log(`  ${exists ? '✅' : '❌'} ${script} script`);
    if (!exists) allFilesExist = false;
  });
} catch (error) {
  console.log('  ❌ Failed to read package.json');
  allFilesExist = false;
}

// Test 5: Check directory structure
console.log('\n📂 Checking directory structure:');
const expectedDirs = ['src/css', 'src/js/components', 'src/js/utils', 'assets/css', 'assets/js'];

expectedDirs.forEach(dir => {
  const exists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) allFilesExist = false;
});

// Final result
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 BUILD ENVIRONMENT TEST PASSED!');
  console.log('✅ All components are properly configured');
  console.log('🚀 Ready to start development');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:8000');
  console.log('3. Start implementing Task 2: Component architecture');
} else {
  console.log('❌ BUILD ENVIRONMENT TEST FAILED!');
  console.log('🔧 Please fix the missing components above');
  console.log('\nTroubleshooting:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run build');
  console.log('3. Check for any error messages');
}
console.log('='.repeat(50));

process.exit(allFilesExist ? 0 : 1);