import http, { IncomingMessage, ServerResponse } from 'http';
import httpProxy from 'http-proxy';
import { spawn } from 'child_process';

const services = [
  { route: "/details", path: 'first-service', port: '3001' },
  { route: "/actions", path: 'second-service', port: '3002' }
];

// Starts `serverless offline` for each service
services.forEach(service => {
  const child = spawn('serverless', ['offline', 'start', '--stage', 'dev', '--noTimeout', '--port', service.port, '--service', service.path], { cwd: './' });
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk: Buffer) => console.log(chunk.toString()));
  child.stderr.on('data', (chunk: Buffer) => console.error(chunk.toString()));
  child.on('close', (code: number) => console.log(`child exited with code ${code}`));
});

// Start a proxy server on port 8080 forwarding based on url path
const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const service = services.find(per => req.url!.match(per.route));

  // Case 1: matching service FOUND => forward request to the service
  if (service) {
    req.url = req.url!.replace(service.route, '');
    proxy.web(req, res, { target: `http://localhost:${service.port}${service.route}` }, function(err: Error) {
      console.error("Error: ", err);
    });
  }
  
  // Case 2: matching service NOT found => display available routes
  else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(`Url path "${req.url}" does not match routes defined in services\n\n`);
    res.write(`Available routes are:\n`);
    services.map(service => res.write(`- ${service.route}\n`));
    res.end();
  }

});

server.listen(8080);