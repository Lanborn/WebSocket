var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

const cors = require('cors')
app.use(cors())
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// 记录已经登录过的用户
const users = []

server.listen(3000, ()=>{
    console.log('server listening on port 3000');
})

// express处理静态资源 把public目录设置为静态资源目录
app.use(require('express').static('public'))


app.get('/', function(req, res) {
    res.redirect('/index.html')
})

io.on('connection', function(socket) {
    console.log('新用户已连接了');
    socket.on('login', data => {
        let user = users.find(item => item.username === data.username );
        if ( user ) {
            // 表示用户存在
            socket.emit('loginError', { 
                msg : '登陆失败'
            })
        } else {
            // 表示用户不存在
            users.push(data);
            // 告诉用户登录成功
            socket.emit('loginSuccess', data)
            // socket.emit: 告诉当前用户
            // io.emit: 广播事件
            io.emit('addUser', data)

            // 告诉所有的用户，当前聊天室有多少人
            io.emit('userList', users)

            // 把登录成功的用户名和头像存储起来
            socket.username = data.username
            socket.avatar = data.avatar 
        }
    });

    // 用户断开连接的功能
    // 监听用户断开连接
    socket.on('disconnect', () =>{
        // 1. 把当前用户的信息从users中删除
        let id = users.findIndex(item => item.username === socket.username);
        users.splice(id, 1);
        // 2. 告诉所有人有人离开了
        io.emit('delUser', {
            username: socket.username,
            avatar: socket.avatar
        })
        // 3. 告诉所有人userList发生更新了
        io.emit('userList', users)
    })

    // 监听聊天功能
    socket.on('sendMessage', data => {
        io.emit('receiveMessage', data)
    })

    // 接收图片信息
    socket.on('sendFile', data => {
        io.emit('receiveFile', data)
    })
})

