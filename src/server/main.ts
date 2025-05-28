import express from "express";
import ViteExpress from "vite-express";
import { UserService } from "./services/UserService.js";
import { SocketService } from "./services/SocketService.js";
import { ServerOptions } from "socket.io";

const port = process.env.PORT || 4000 
const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Soom Chat!");
});

const server = ViteExpress.listen(app, +port, () =>
  console.log(`Server is listening on port ${port}...`),
);

const userService = new UserService();
SocketService.initialize(server as Partial<ServerOptions>, userService, () =>
  console.log('Web Sockets server is running'));
