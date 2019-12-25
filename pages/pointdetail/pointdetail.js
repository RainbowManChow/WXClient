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
    filmDetail: {},
    showLoading: false,
    imagesshow:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var object = this.data.filmDetail;
    this.data.markers = JSON.parse(options.markers);
    this.data.markerId = options.markerId;
    var images="",description="",user="",location="";
    var imagess = new Array();
    var resultimagess = new Array();
    for (let item of this.data.markers) {
      if (item.id == options.markerId) {
        images =item.needimages;
        imagess=images.split(",");
        for (var j = 0, len = imagess.length; j < len; j++) {
          resultimagess.push(app.globalData.paurl + '/WXIndex/getImages?imgurl='+imagess[j]);
        }
        that.imagesshow = resultimagess;
        object.imagess = resultimagess;
        object.location = item.needlocation;
        object.images = app.globalData.paurl + '/WXIndex/getImages?imgurl='+imagess[0];
        object.user = item.needusername;
        object.good = item.needdescription;
        object.title = item.needtitle;
        object.time = item.needrecentdate;
        that.setData({
          filmDetail: object,
          showLoading: false
        });
      }
      }
  /**  object.good="haha";
    object.images = app.globalData.paurl + '/WXIndex/getImages?imgurl=' //+"E:/pic/wx1da383f6062172ae.2019-12-10-16-14-01-346.jpg";
    timer = setTimeout(function () {
      console.log("----Countdown----");
      that.setData({
        filmDetail: object,
        showLoading: false
      });
    }, 3000);
    **/
   
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.filmDetail.imagess// 需要预览的图片http链接列表  
    })
  },
  goto: function () {
    gotowhere(this.data.markers, this.data.markerId);
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
    if (item.id == markerId) {
      let lat = parseFloat(item.latitude);
      let lon = parseFloat(item.longitude);
      let name = item.callout.content;
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