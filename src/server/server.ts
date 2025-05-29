import { createServer } from 'node:http';
import * as path from 'node:path';
import express from 'express';
import type { Request, Response } from 'express';
import { Server } from 'socket.io';
import { UserService } from './services/UserService.js';
import { SocketService } from './services/SocketService.js';

// Configure build file path and filename location
const BUILD_PATH = '../../dist';
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

// Health API endpoint
app.get("/hello", (_: Request, res: Response) => {
  res.send("Hello Soom Chat!");
});

// Fallback catch-all route that serves React app's index.html regardless clientside route.
app.get('*channel', (_: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, BUILD_PATH, INDEX_FILENAME));
});


// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO listening for connections.`);
});

// Instantiate and initialize services
const userService = new UserService();
SocketService.initialize(httpServer, userService, () => {
  console.log('Web Sockets server is running');
});
