// pages/userCenter/userCenter.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    phone:null,
    items:[],
    rencentcount:""
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.paurl + '/WXIndex/getRecentHelpByOpenid',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        'userid': app.globalData.userId
      },
      success: function (res) {
        that.setData({
          items: res.data,
          userInfo: app.globalData.userInfo,
          rencentcount: res.data.length
        });

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


  },
  unfinished () {
    wx.showToast({
      title: '敬请期待',
      icon:"none"
    })
  },
 gorecentinfo() {
   var that=this;
   wx.navigateTo({
     url: '/pages/receninfo/receninfo?items=' + JSON.stringify(that.data.items)
   })
  },
  logout(){
    app.globalData.loginStatus = 0;
    wx.removeStorage({
      key: 'phone'
    })
    wx.redirectTo({
      url: '/pages/init/init'
    })
  }
})