// pages/receninfo/msgdetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   info:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var status =options.status;
    var id = options.id;
   this.setData({
     info: options.info
   })
    if (status=='0'){
      wx.request({
        url: app.globalData.paurl + '/WXIndex/updateMsgStatus',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        data: {
          'id': id
        },
        success: function (ress) {
          app.getInitMsg();
        },
        fail: function (ress) {
          console.log(ress);
        }
      })
   }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})