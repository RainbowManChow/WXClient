//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  openSocket() {
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      this.globalData.socketStatus = 'connected';
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.globalData.socketStatus = 'closed'
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      //把JSONStr转为JSON

      message = message.data.replace(" ", "");
      if (typeof message != 'object') {
        message = message.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(message);
        message = jj;
      }
      console.log("【websocket监听到消息】内容如下：");
      console.log(message);
    })
    // 打开信道
    wx.connectSocket({
      url: this.globalData.wsurl+ "/imserver/"+this.globalData.userId,
    })
  },

  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },

  //发送消息函数
  sendMessage(message) {
    if (this.globalData.socketStatus === 'connected') {
      //自定义的发给后台识别的参数 ，我这里发送的是name
      var msg = "{";
      msg += "\"toUserId\":\"" + this.globalData.userId + "\"";
      msg += ",\"msg\":\"" + message + "\"";
      msg += "}";
      wx.sendSocketMessage({
        data: msg
      })
    }
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    code: null,
    userId: null,
    keys: null,
    access: null,
    socketStatus: 'closed',
    paurl: 'https://rainbowman.goho.co',  //http://localhost:9999 //https://rainbowman.goho.co
    wsurl: 'wss://rainbowman.goho.co'
  },
  title: [],
  imgUrls: [],
  author: [],
  date: [],
  url: [],
  requestUrl: "top",
  cssActive: 0,
  page: 0,
})