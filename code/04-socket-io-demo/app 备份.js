const http = require('http');
const fs = require('fs');
const app = http.createServer();

app.on('request', (req, res) => {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if(err) {
            res.writeHead(500)
            return res.end('Error loading index.html');
        }

        res.writeHead(200)
        res.end(data);
    })
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});

const io = require('socket.io')(app)

io.on('connection', socket => {
    console.log('新用户连接了')
    socket.on('hehe', data => {
        console.log(data);
        socket.emit('send', data)
    })
})