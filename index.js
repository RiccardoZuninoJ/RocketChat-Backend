var app = require('express')();
var cors = require('cors');
var server = require('http').Server(app);
var io = require('socket.io')(server, { cors: { origin: '*' } });


io.on('connection', function (socket) {
    console.log("Client connected - " + socket.id);
    socket.on('msg_broadcast_sent', (data) => {
        let completeData = {
            from: data.from,
            text: data.text,
            dateTime: new Date()
        }
        console.log(completeData);
        io.emit('msg_broadcast', completeData);
    })
    io.on('disconnect', function () {
        console.log("User disconnected!");
    });
});

server.listen(80, () => {
    console.log('Server running and listening on port 80');
});