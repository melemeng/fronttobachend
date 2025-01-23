const express = require('express');

const server = require('http').createServer();

const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);

server.listen(3000, () => {
  console.log('Server started on port 3000');
});

/** Begin websocket server */
const WebSocketServer = require('ws').Server; // websocket libra
const wss = new WebSocketServer({ server : server});

wss.on('connection', function connection(ws) {
  const numClients = wss.clients.size;
  console.log('Client connected. Total connected clients:', numClients);

  wss.broadcast(`Current connected clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('Welcome to the server!');
  }



  ws.on('close', function close() {
    console.log('Client disconnected. Total connected clients:', wss.clients.size);
    wss.broadcast(`Current connected clients: ${wss.clients.size}`);
  });



});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};