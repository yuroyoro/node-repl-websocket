var sys = require('sys')
  , http = require("http")
  , ws = require('./vender/node-websocket-server/lib/ws');

var httpServer = http.createServer();

var server = ws.createServer({
  debug: true
}, httpServer);

// Handle WebSocket Requests
server.addListener("connection", function(conn){
  sys.log("opened connection: "+conn.id);
  server.send(conn.id, "Connected as: "+conn.id);
  var repl = require("repl");
  repl.start("node via websocket> ", conn);
  conn.addListener("message", function(message){
    conn.emit("data", message );
  });
});

server.addListener("close", function(conn){
  sys.log("closed connection: "+conn.id);
  conn.broadcast("<"+conn.id+"> disconnected");
});

server.listen(8000);
