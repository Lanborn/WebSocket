const http = require('http');
const fs = require('fs');
const app = http.createServer();

app.on('request', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
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

// 监听了用户连接的事件
io.on('connection', socket => {
    console.log('新用户连接了')
    // socket.emit方法表示给浏览器发送的数据
    // 参数1：事件的名字
    // socket.emit('send', {name : 'zs'})

    // 参数1: 事件名：任意
    // 参数2： 获取到的数据
    socket.on('hehe', data => {
        console.log(data);

        socket.emit('send', data)
    })
})