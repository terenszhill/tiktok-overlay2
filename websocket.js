// Egyszerű Node.js szerver WebSocket + Webhook támogatással
// Futtatható Render.com-on vagy Glitch-en

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

function broadcast(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

app.post("/vote/:team", (req, res) => {
  const team = req.params.team.toLowerCase();
  if (team === "piros" || team === "kek") {
    broadcast(team);
    res.status(200).send("OK");
  } else {
    res.status(400).send("Invalid team");
  }
});

app.get("/", (req, res) => {
  res.send("Webhook + WebSocket szerver fut.");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT} porton`);
});