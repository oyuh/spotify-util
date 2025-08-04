const fs = require('fs');
const path = require('path');

// List all development routes
function listDevRoutes() {
  const devDir = path.join(__dirname, '../src/app/api/dev');

  if (!fs.existsSync(devDir)) {
    console.log('No dev directory found');
    return;
  }

  console.log('🔧 Development API Routes:');
  console.log('=========================');

  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const routePath = `${prefix}/${item.name}`;
        console.log(`📁 ${routePath}/`);

        // Check if it has a route.ts file
        const routeFile = path.join(dir, item.name, 'route.ts');
        if (fs.existsSync(routeFile)) {
          console.log(`   └── 🚀 /api/dev${routePath}`);
        }

        // Recursively scan subdirectories
        scanDirectory(path.join(dir, item.name), routePath);
      }
    }
  }

  scanDirectory(devDir);

  console.log('\n📝 Notes:');
  console.log('- These routes are blocked in production');
  console.log('- Access via: http://localhost:3000/api/dev/...');
  console.log('- See src/app/api/dev/README.md for details');
}

if (require.main === module) {
  listDevRoutes();
}

module.exports = { listDevRoutes };
