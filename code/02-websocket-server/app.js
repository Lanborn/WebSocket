const ws = require('nodejs-websocket');
const port = 3000


// 2. 创建一个server
// 2.1 如何处理用户的请求

// 每次只要有用户链接，函数就会被执行，会给当前的用户创建一个connection对象


let server = ws.createServer(connection => {
    console.log('有用户连上来了');
    // 每当结构到用户传递过来的数据，这个text事件会被触发
    connection.on('text', result => {
        console.log('发送消息', result);
        // 给用户一个响应的数据

        // 对用户发送过来的数据，把小写转换成大写，并且拼接一点内容
        connection.send(result.toUpperCase() + "!!!");
    })
    // 
    connection.on('connect', code => {
        console.log('开启连接', code);
    })

    // 连接断开
    connection.on('close', code => {
        console.log('关闭连接', code);
    })

    // 注册一个error, 处理用户的错误信息
    connection.on('error', code => {
        console.log('异常关闭', code);
    })
})

server.listen(port, () => {
    console.log('WebSocket服务启动成功，监听'+port);
})