// pages/pointdetail/pointdetail.js
var app = getApp()
var timer; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: {},
    markerId:"",
    lat:"",
    lon:"",
    filmDetail: {},
    showLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let markers = JSON.parse(options.markers);
    let lat = options.markerId;
    let lon = options.markerId;
    var markerId = options.markerId;
    var object = this.data.filmDetail;
    this.data.markers = markers;
    this.data.markerId = markerId;
    this.data.lat = lat;
    this.data.lon=lon;
    object.good="haha";
    object.images = app.globalData.paurl + '/WXIndex/getImages/' +"wx1da383f6062172ae.2019-12-10-16-14-01-346.jpg";
    timer = setTimeout(function () {
      console.log("----Countdown----");
      that.setData({
        filmDetail: object,
        showLoading: false
      });
    }, 3000);
   
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

  },
  onPageScroll: function (e) {
  /**  if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } **/
  }  
})
function gotowhere(markers, markerId){
  for (let item of markers) {
    if (item.id === markerId) {
      lat = item.latitude;
      lon = item.longitude;
      name = item.callout.content;
      wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
        latitude: lat,
        longitude: lon,
        name: name,
        success: function (res) {
          console.log(res);
        },
        fail: function (res) {
          console.log(res);
        }
      })
      break;
    }
  }



}