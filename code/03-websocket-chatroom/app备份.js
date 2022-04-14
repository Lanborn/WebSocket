const ws = require('nodejs-websocket')

// 记录用户数量
let count = 0

const server = ws.createServer(conn => {
    console.log('新的连接');
    count++;
    conn.userName = `用户${count}`
    // 1. 通知新的用户进来了
    broadcast(`${conn.userName}进入了聊天室`)
    // 接收到了浏览器的数据
    conn.on('text', ( result ) => {
        // 2. 当我们接收到某个用户的信息的时候，告诉所有用户，发送的消息内容是什么
        broadcast(result)
    })
    conn.on('close',  data  => {
        console.log('关闭连接');
        count--;
        // 3. 告诉所有的用户，有人离开了聊天室
        broadcast(`${conn.userName}离开了聊天室`) 
    })
    conn.on('error',  data  => {
        console.log('发生异常');
    })
})

function broadcast (msg) {
    server.connections.forEach(item => {
        item.send(msg);
    })
}

server.listen(3000, () => {
    console.log('监听端口3000');
});