const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});

// begin websocket server
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log(`Client connected. Total clients: ${numClients}`);

  wss.broadcast(`Client connected. Total clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to the websocket server!");
  }

  ws.on("close", function close() {
    ws.send("Client disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};
