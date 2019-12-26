// pages/userCenter/userCenter.js
const app = getApp()
Page({
  data: {
    userInfo: {},
    phone:null
  },
  onLoad: function (options) {
    wx.getUserInfo({
      success:(e)=>{
        console.log(e.userInfo)
        this.setData({
          userInfo: e.userInfo
        })
      }
    })
    wx.getStorage({
      key: 'phone',
      success: (res) => {
        this.setData({
          phone:res.data
        })
      }
    })
  },
  unfinished () {
    wx.showToast({
      title: '敬请期待',
      icon:"none"
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