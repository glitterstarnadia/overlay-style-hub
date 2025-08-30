#!/usr/bin/env node

const { spawn } = require('child_process');
const { exec } = require('child_process');

console.log('🚀 Starting Electron Development Mode...');

let viteProcess;
let electronProcess;

// Function to start Vite dev server
function startVite() {
  console.log('⚛️ Starting Vite dev server...');
  viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true
  });

  viteProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[Vite] ${output}`);
    
    // Check if server is ready
    if (output.includes('Local:') && output.includes('8080')) {
      console.log('✅ Vite server ready, starting Electron...');
      setTimeout(startElectron, 2000); // Wait 2 seconds for server to be fully ready
    }
  });

  viteProcess.stderr.on('data', (data) => {
    console.error(`[Vite Error] ${data}`);
  });
}

// Function to start Electron
function startElectron() {
  console.log('🖥️ Starting Electron...');
  electronProcess = spawn('npx', ['electron', 'electron/main.cjs'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
    shell: true
  });

  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    cleanup();
  });
}

// Function to cleanup processes
function cleanup() {
  console.log('🧹 Cleaning up processes...');
  if (viteProcess) {
    viteProcess.kill();
  }
  if (electronProcess) {
    electronProcess.kill();
  }
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the development process
startVite();