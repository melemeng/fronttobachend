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

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close();
  });

  server.close(() => {
    shutdowndb();
  });
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

  dbb.run(`INSERT INTO visitors (count, time) 
    VALUES (${numClients}, datetime('now'))`
    );


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

/** End websocket server */
/** begin database connection */
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
      CREATE TABLE visitors (
          count INTEGER,
          time TEXT
        )
    `); 
});

function getCounts() {
  db.each('SELECT * FROM visitors', (err, row) => {
    console.log('result: ', row);
  });
}

function shutdowndb() {
  getCounts();
  console.log('Shutting down server');
  db.close();
 
}