var app = getApp()
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function (option) {
    app.globalData.recentmsgJS = this
    var that = this;
    that.setData({
      items: app.globalData.messageList,
      userInfo: app.globalData.userInfo
    });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that=this
    wx.showModal({
      title: '删除通知',
      content: '请确认是否删除这条通知？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.paurl + '/WXIndex/deleteHelp',
            method: "POST",
            data: {
              id: e.currentTarget.dataset.id
            },
            header: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            success: res => {
              wx.showToast({
                title: "删除成功"
              })
              that.data.items.splice(e.currentTarget.dataset.index, 1)
              that.setData({
                items: that.data.items
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  godetail: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/receninfo/msgdetail?info=' + e.currentTarget.dataset.info + "&id=" + e.currentTarget.dataset.id + "&status=" + e.currentTarget.dataset.status
    })
  }
})

