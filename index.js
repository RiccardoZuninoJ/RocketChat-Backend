var app = require('express')();
var cors = require('cors');
var server = require('http').Server(app);
var io = require('socket.io')(server, { cors: { origin: '*' } });
const port = process.env.PORT || 3000;

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

//Add an index route saying server is running
app.get('/', function (req, res) {
    res.send('Server is running!');
});

server.listen(port, () => {
    console.log('Server running and listening on port ' + port);
});