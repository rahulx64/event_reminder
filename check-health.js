#!/usr/bin/env node

/**
 * Event Reminder - Health Check Script
 * Verifies that frontend and backend are running correctly
 */

const http = require('http');
const https = require('https');

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:5173';

async function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/auth/login`, (res) => {
      // If we get a response, the server is running
      resolve({
        status: 'running',
        port: 4000,
        url: BACKEND_URL
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'not_running',
        port: 4000,
        url: BACKEND_URL,
        error: err.message
      });
    });

    req.setTimeout(2000);
  });
}

async function checkFrontend() {
  return new Promise((resolve) => {
    const req = http.get(`${FRONTEND_URL}/`, (res) => {
      resolve({
        status: 'running',
        port: 5173,
        url: FRONTEND_URL
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'not_running',
        port: 5173,
        url: FRONTEND_URL,
        error: err.message
      });
    });

    req.setTimeout(2000);
  });
}

function printStatus(service, result) {
  const status = result.status === 'running' ? '✅' : '❌';
  console.log(`\n${status} ${service.toUpperCase()}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   URL: ${result.url}`);
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  Event Reminder - Health Check');
  console.log('═══════════════════════════════════════════');

  const backendStatus = await checkBackend();
  const frontendStatus = await checkFrontend();

  printStatus('Backend', backendStatus);
  printStatus('Frontend', frontendStatus);

  const allRunning = 
    backendStatus.status === 'running' && 
    frontendStatus.status === 'running';

  console.log('\n═══════════════════════════════════════════');

  if (allRunning) {
    console.log('\n✨ All services are running!');
    console.log('\nYou can access the app at:');
    console.log(`  Frontend: ${FRONTEND_URL}`);
    console.log(`  Backend:  ${BACKEND_URL}`);
  } else {
    console.log('\n⚠️  Some services are not running.');
    console.log('\nTo start services:');
    if (backendStatus.status !== 'running') {
      console.log('  1. Backend: cd backend && npm run dev');
    }
    if (frontendStatus.status !== 'running') {
      console.log('  2. Frontend: cd frontend && npm run dev');
    }
  }

  console.log('\n═══════════════════════════════════════════\n');

  process.exit(allRunning ? 0 : 1);
}

main();
