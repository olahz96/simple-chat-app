const express = require('express');
const socket = require('socket.io');

const app = express();

app.use(express.static('public'));

const server = app.listen(3000);

const io = socket(server);

io.on('connect', socket => {
    console.log('Client conneceted: ', socket.id);

    socket.on('setUser', data => {
        data = data.charAt(0).toUpperCase() + data.slice(1)
        socket.broadcast.emit('joinMessage', `${data} has joined to the server!`);
    });

    socket.on('chat', data => {
        io.emit('chat', data);
    });

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });
})