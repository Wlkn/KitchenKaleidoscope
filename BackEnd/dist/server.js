"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const app = require("./app");
app.set("port", 4000);
const server = http.createServer(app);
server.listen(4000);
