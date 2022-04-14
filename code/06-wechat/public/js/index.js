// 1. 连接socket.io服务

var socket = io('http://localhost:3000')

var user = {}

// 2. 登录功能

// 2.1 选择头像

$('#login_avatar li').on('click', function (e) {
  $(this)
    .addClass('now')
    .siblings()
    .removeClass('now')
})

// 点击按钮，登录

$('#loginBtn').on('click', function (e) {
  const username = $('#username').val().trim();
  if(!username) {
    alert('Please enter a username')
    return
  }
  // 获取选择的头像
  var avatar = $('#login_avatar li.now img').attr('src')


  // 告诉socket服务要登陆
  socket.emit('login', {
    username, 
    avatar
  })

  // 监听登录失败
  socket.on('loginError', data => {
    alert('用户名已存在，登陆失败')
  })
  // 登录成功
  socket.on('loginSuccess', data => {
    alert('登录成功了')
    $(".login_box").fadeOut()
    $(".container").fadeIn()
    // 设置个人信息
    $('.avatar_url').attr('src', data.avatar);

    $('.user-list .username').text(data.username)
    // 存储当前用户的信息
    user = data
  })
  

  // 监听添加用户的消息
  socket.on('addUser', data => {
    // 添加一条系统消息
    $('.box-bd').append(`
      <div class="system">
        <p class="message_system">
          <span class="content">${data.username}加入了群聊</span>
        </p>
      </div>
    `)

    scrollIntoView ()
  })

  // 显示用户列表
  socket.on('userList', data => {
    $('.user-list ul').html('')
    data.forEach(user => {
      $('.user-list ul').append(`
        <li class="user">
          <div class="avatar"><img src="${user.avatar}" alt="" /></div>
          <div class="name">${user.username}</div>
        </li>
      `)
    })

    $('#userCount').text(data.length)
  })

  // 监听用户离开的消息
  socket.on('delUser', data => {
    // 添加一条系统消息
    $('.box-bd').append(`
      <div class="system">
        <p class="message_system">
          <span class="content">${data.username}离开了群聊</span>
        </p>
      </div>
    `)

    scrollIntoView ()
  })

  // 聊天功能
  $('.btn-send').on('click', ()=>{
    // 获取到聊天的内容
    var content =  $('#content').html();
    $('#content').html('')
    if (!content) return alert('请输入内容')

    //发送给服务器
    socket.emit('sendMessage', {
      msg : content, 
      username : user.username,
      avatar : user.avatar
    })
  })
  
  // 监听聊天的消息
  socket.on('receiveMessage', data => { 
    console.log(data);
    // 展示
    // 先判断是自己的还是别人的
    if(data.username === user.username) {
      // 自己的
      $('.box-bd').append(`
        <div class="message-box">
          <div class="my message">
            <img class="avatar" src="${data.avatar}" alt="" />
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
              </div>
            </div>
          </div>
        </div>
      `)
    }else {
      // 别人的
      $('.box-bd').append(`
        <div class="message-box">
          <div class="other message">
            <img class="avatar" src="${data.avatar}" alt="" />
            <div class="content">
              <div class="nickname">${data.username}</div>
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
              </div>
            </div>
          </div>
        </div>
      `)
    }

    // 底部滚动
    scrollIntoView ()
  })
})

function scrollIntoView () {
  $('.box-bd')
   .children(':last')
   .get(0)
   .scrollIntoView(false)
}

// 发送图片

$('#file').on('change', function (e) {
  var file = this.files[0]

  // 把文件发送到服务器

  // 需要借助于h5新增的fileReader
  var fr = new FileReader();
  // 转成base64编码
  fr.readAsDataURL(file)
  
  fr.onload = function () {
    console.log(fr.result);
    socket.emit('sendFile',{
      user,
      Image : fr.result 
    })
  }
})

  // 监听聊天的消息
socket.on('receiveFile', data => { 
    if(data.username === user.username) {
      // 自己的
      $('.box-bd').append(`
        <div class="message-box">
          <div class="my message">
            <img class="avatar" src="${data.user.avatar}" alt="" />
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">
                  <img src="${data.Image}" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `)
    }else {
      // 别人的
      $('.box-bd').append(`
        <div class="message-box">
          <div class="other message">
            <img class="avatar" src="${data.user.avatar}" alt="" />
            <div class="content">
              <div class="nickname">${data.user.username}</div>
              <div class="bubble">
                <div class="bubble_cont"><img src="${data.Image}" alt="" /></div>
              </div>
            </div>
          </div>
        </div>
      `)
    }

    // 等待图片加载完成
    $('.box-bd img:last').on('load', () => {
      scrollIntoView ()
    })
})

// 初始化jquery-emoji插件
$('.face').on('click', () => {
  $('#content').emoji({
    button: '.face',
    showTab : false,
    animation : 'fade',
    position : 'topRight',
    icons : [
      {
        name : 'QQ表情',
        path : '../lib/jquery-emoji/img/qq/',
        maxNum : 91,
        excludeNums : [41,45,44],
        file : '.gif'
      },
      {
        name : 'emoji表情',
        path : '../lib/jquery-emoji/img/emoji/',
        maxNum : 84,
        excludeNums : [41,45,44],
        file : '.png'
      },
      {
        name : '贴吧表情',
        path : '../lib/jquery-emoji/img/tieba/',
        maxNum : 50,
        excludeNums : [41,45,44],
        file : '.jpg'
      }
    ],
  })
})
