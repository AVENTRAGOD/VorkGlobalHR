import handler from './api/index.ts';
import { EventEmitter } from 'events';

function createMockReq(url, method = 'GET') {
  const req = new EventEmitter();
  req.url = url;
  req.method = method;
  req.headers = {};
  return req;
}

function createMockRes() {
  const res = new EventEmitter();
  res.statusCode = 200;
  res.setHeader = () => {};
  res.end = () => {};
  res.json = () => {};
  return res;
}

async function testRoutes() {
  const routesToTest = [
    { method: 'POST', url: '/auth/login' },
    { method: 'GET', url: '/users' },
    { method: 'GET', url: '/attendance' },
    { method: 'POST', url: '/attendance/check-in' },
    { method: 'POST', url: '/attendance/check-out' },
  ];

  for (const route of routesToTest) {
    const req = createMockReq(route.url, route.method);
    const res = createMockRes();
    
    console.log(`Testing original req.url: ${route.method} ${route.url}`);
    
    // Call the handler
    handler(req, res);
    
    console.log(`Express received req.url: ${req.url}\n`);
  }
}

testRoutes();
