const ws = require('nodejs-websocket')

const TYPE = {
    ENTER : 0,
    LEAVE : 1,
    MSG : 2,
}

let count = 0

const server = ws.createServer(conn => {
    console.log('新的连接');
    count++;
    conn.userName = `用户${count}`
    broadcast({
        type : TYPE.ENTER,
        msg : `${conn.userName}进入了聊天室`,
        time : new Date().toLocaleTimeString()
    })
    conn.on('text', ( result ) => {
        broadcast({
            type: TYPE.MSG,
            msg : result,
            time : new Date().toLocaleTimeString()
        })
    })
    conn.on('close',  data  => {
        console.log('关闭连接');
        count--;
        broadcast({
            type: TYPE.LEAVE,
            msg : `${conn.userName}离开了聊天室`,
            time : new Date().toLocaleTimeString()
        }) 
    })
    conn.on('error',  data  => {
        console.log('发生异常');
    })
})

function broadcast (msg) {
    server.connections.forEach(item => {
        item.send(JSON.stringify(msg));
    })
}

server.listen(3000, () => {
    console.log('监听端口3000');
});