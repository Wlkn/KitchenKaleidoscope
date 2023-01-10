import http = require("http");
const app = require("./app");

app.set("port", 4000);
const server = http.createServer(app);

server.listen(4000);
