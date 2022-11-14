var app = require('express')();
var cors = require('cors');
var server = require('http').Server(app);
var io = require('socket.io')(server, { cors: { origin: '*' } });
const port = process.env.PORT || 4000;
var bcrypt = require('bcrypt');

var connectedUsers = [];

io.on('connection', function (socket) {
    console.log("Client connected - " + socket.id);
    //Add user to an array

    connectedUsers.push({ id: socket.id, publicKey: null });
    //Receive public key from client
    socket.on('publicKey', function (data) {
        console.log("Received public key from client - " + data);
        //Find user in array and update public key
        connectedUsers.forEach(function (user) {
            if (user.id == socket.id) {
                user.publicKey = data;
            }
        });
    });
    socket.on('get_public_key', (data) => {
        console.log("Received public key request for client - " + data.to);
        //Find user in array and update public key
        connectedUsers.forEach(function (user) {
            if (user.id == data.to) {
                console.log("Sending public key to client - " + data.to);

                socket.emit('public_key_ack', user.publicKey);
            }
        });
    });
    //Send to certain client in data.recipientId
    socket.on('msg', (data) => {
        console.log("Received message from client - " + data.text);
        console.log("Sending message to client - " + data.to);
        //Send to recipient
        io.to(data.to).emit('msg', data);
    })
    socket.on('msg_broadcast_sent', (data) => {
        let completeData = {
            from: data.from,
            text: data.text,
            dateTime: new Date()
        }
        console.log(completeData);
        io.emit('msg_broadcast', completeData);
    })
    socket.on('msg_private_sent', (data) => {
        let completeData = {
            from: data.from,
            to: data.to,
            text: data.text,
            dateTime: new Date()
        }
        console.log(completeData);
        //Send the message to the socketid of the client in the data.to field
        io.to(data.to).emit('msg_private', completeData);
    })
    io.on('disconnect', function () {
        console.log("User disconnected!");
        //Remove user from the array
        connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
    });
});

//Add an index route saying server is running
app.get('/', function (req, res) {
    res.send('Server is running!');
});

server.listen(port, () => {
    console.log('Server running and listening on port ' + port);
});