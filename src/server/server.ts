import * as path from 'node:path';
import { createServer } from 'node:http';
import express from 'express';
import type { Request, Response } from 'express';
import { Server } from 'socket.io';
import { UserService, SocketService } from './services/index.js';

// Configure build file path and filename location
const BUILD_PATH = '../../dist/client';
const INDEX_FILENAME = 'index.html';
const { pathname: __dirname } = new URL('../server', import.meta.url);

// Declare Express and Server object instances
const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'], // Allow Vite dev server to connect
    methods: ["GET", "POST"]
  }
});

// Serve static files from the {@link BUILD_PATH} build directory for PROD
app.use(express.static(path.join(__dirname, BUILD_PATH)));
if (process.env.NODE_ENV === 'production') {
}

// Expose a Health API endpoint for the CI pipeline
app.get("/hello", (_: Request, res: Response) => {
  res.send("Hello Shoom Chat!");
});

// Fallback catch-all route that serves React app's index.html
app.get('*channel', (_: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, BUILD_PATH, INDEX_FILENAME));
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO listening for connections.`);
});

// Instantiate and initialize data services
SocketService.initialize({
  httpServer,
  userService: new UserService(),
  onReady: () => console.log('Web Sockets server is running'),
});
