const http = require('http');
const express = require('express'); 
const socketIO = require('socket.io'); 
const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);


var ledGreenStatus = 0;

app.use(express.static(__dirname + '/public'));


server.listen(3000, function () {
    console.log('server listening on port', 3000);
});

const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;

const port = new Serialport('COM3', {
    baudRate: 115200
});

const parser = port.pipe(new Readline({ delimeter: '\r\n'}));

parser.on('open', function () {
    console.log('connection is opened');
});

parser.on('data', function (data) {
    var x = data.split(' ');
    io.emit('temperature', x[0]);
    io.emit('lighting', x[1]);
    io.emit('servo', x[2]);
});

port.on('error', function (err) {
    console.log(err);
});

io.on('connection', function (socket) {
    socket.on('LedGreen', function(msg){
        ledGreenStatus ^= 1;
        port.write('' + ledGreenStatus);
    });
});