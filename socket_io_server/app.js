
var config = require("./parameters");

var express = require("express");
var app = express();
var http = require('http')
var https = require('https');

var server = http.createServer(app);

var io = require('socket.io').listen(server);

var clients = {};

function debugLog(message) {
    if (config.DEBUG_MODE) {
        console.log(message);
    }
}

// authentication for socket
io.on('connection', function(socket){
    debugLog('[IO] Connected ' + socket.id);

    clients[socket.id] = socket;

    socket.on('join-list', function(data) {
        debugLog('[IO] Join list channel ' + data.id);
        socket.join('list_' + data.id);
    });

    socket.on('leave-list', function(data) {
        debugLog('[IO] Leave list channel ' + data.id);
        socket.leave('list_' + data.id);
    });

    socket.on('task-added', function(data) {
        debugLog('[IO] Task added ' + data.listId + ' / ' + data.task.title);
        debugLog('[IO] Task added ' + data.listId + ' / ' + data.task.id);
        io.sockets.in('list_' + data.listId).emit('task-added', data);
    });

    socket.on('task-completed-changed', function(data) {
        debugLog('[IO] Task completed changed ' + data.listId + ' / ' + data.task.id);
        io.sockets.in('list_' + data.listId).emit('task-completed-changed', data);
    });

    socket.on('disconnect', function() {
        debugLog('[IO] Disconnect ' + socket.id);
        delete clients[socket.id]
    });
});

server.listen(config.PORT);

