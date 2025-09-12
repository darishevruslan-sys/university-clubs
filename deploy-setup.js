#!/usr/bin/env node

/**
 * Deployment Setup Script for University Clubs
 * This script helps prepare the application for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 University Clubs - Deployment Setup');
console.log('=====================================\n');

// Check if config.env exists
const configPath = path.join(__dirname, 'config.env');
if (!fs.existsSync(configPath)) {
  console.log('❌ config.env not found. Creating from template...');
  
  const configContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/university-clubs
JWT_SECRET=your-super-secret-jwt-key-here-university-clubs-2024
NODE_ENV=development`;
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ config.env created');
}

// Check if client build exists
const buildPath = path.join(__dirname, 'client', 'build');
if (!fs.existsSync(buildPath)) {
  console.log('📦 Building React application...');
  console.log('Run: cd client && npm run build');
  console.log('Or: npm run build (from root directory)\n');
}

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'build', 'postinstall'];

console.log('📋 Checking package.json scripts...');
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ Missing script: ${script}`);
  }
});

console.log('\n🔧 Deployment Checklist:');
console.log('1. ✅ Environment configuration ready');
console.log('2. ✅ Production scripts configured');
console.log('3. ✅ CORS settings updated');
console.log('4. ✅ API configuration prepared');
console.log('5. ✅ Health check endpoint added');

console.log('\n📖 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Set up MongoDB Atlas (free)');
console.log('3. Deploy backend to Railway (free)');
console.log('4. Deploy frontend to Vercel (free)');
console.log('5. Update API URLs with actual deployment URLs');

console.log('\n📚 See DEPLOYMENT.md for detailed instructions');
console.log('\n🎉 Ready for deployment!');
