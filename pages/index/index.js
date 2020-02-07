var app = getApp()
Page({
  onLoad: function (options) {
    // 登录
    wx.login({
      success: res => {
        app.globalData.code = res.code
        //取出本地存储用户信息，解决需要每次进入小程序弹框获取用户信息
        app.globalData.userInfo = wx.getStorageSync('userInfo')
        //wx.getuserinfo接口不再支持
        wx.getSetting({
          success: (res) => {
            //判断用户没有授权，默认弹出授权框
            if (!res.authSetting['scope.userInfo']) {
            } else {//已经授权自动拉取后台数据登录
              wx.showLoading({
                title: '加载中...'
              })
              this.getOP(app.globalData.userInfo)
            }
          },
          fail: function () {
            wx.showToast({
              title: '系统提示:网络错误',
              icon: 'warn',
              duration: 1500,
            })
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '系统提示:网络错误',
          icon: 'warn',
          duration: 1500,
        })
      }
    })
  },
  //获取用户信息新接口
  agreeGetUser: function (e) {
    let that = this
    //设置用户信息本地存储
    try {
      if (e.detail.userInfo){
        wx.setStorageSync('userInfo', e.detail.userInfo);
        wx.showLoading({
          title: '加载中...'
        })
        that.getOP(e.detail.userInfo)
      }else{
        wx.showToast({
          title: '授权失败',
          icon: 'warn',
          duration: 1500,
        })
      }
    } catch (e) {
      wx.showToast({
        title: '授权失败',
        icon: 'warn',
        duration: 1500,
      })
    }
  },
  getOP: function (res) {//提交用户信息 获取用户id
    let that = this
    let userInfo = res
    app.globalData.userInfo = userInfo
    wx.request({
      url: app.globalData.paurl+'/WXIndex/getOpenid',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'code': app.globalData.code,
        'userInfo': JSON.stringify(userInfo)
      },
      success: function (res) {
        if (res.data.respcode == '0') {
          app.globalData.userId = res.data.uid;
          wx.hideLoading();//'/pages/mapindex/mapindex'
          wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候
            url: '/pages/mapindex/mapindex'
          })
        } else if (res.data.respcode == '15') {
          wx.hideLoading()
          wx.showToast({
            title: '请下拉刷新重新授权',
            icon: 'none',
            duration: 2000
          })
        }else{
          console.log(res.data.respcode);
          wx.hideLoading();
          wx.showToast({
            title: '请下拉刷新重新授权',
            icon: 'none',
            duration: 1500,
          });
        }

      },
            fail: function () {
       wx.hideLoading();
        wx.showToast({
          title: '请重新授权',
          icon: 'warn',
          duration: 1500,
        });
      }
    })
  }
  ,
  data: {
    popup: false
  },
  /* 隐藏弹窗 */
  hidePopup(flag = true) {
    this.setData({
      "popup": flag
    });
    wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候
      url: '/pages/mapindex/mapindex'
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
  /* 显示弹窗 */
  showPopup() {
    this.hidePopup(false);
  },
})