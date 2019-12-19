const app = getApp()

Page({
  data: {
  },
  onLoad: function () {
    var self = this;
    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res);
        wx.request({
          url: app.globalData.paurl + '/WXIndex/getRecentHelp',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            'latitude': res.latitude,
            'longitude': res.longitude
          },
          success: function (ress) {
            self.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: ress.data.markers,
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

      
      }
    })
  },
  gotohere: function (res) {
    console.log(res);
    let lat = ''; // 获取点击的markers经纬度
    let lon = ''; // 获取点击的markers经纬度
    let name = ''; // 获取点击的markers名称
    let markerId = res.markerId;// 获取点击的markers  id
    let markers = res.currentTarget.dataset.markers;// 获取markers列表

    wx.navigateTo({
      url: '/pages/pointdetail/pointdetail?markers=' + JSON.stringify(markers) + '&markerId=' + markerId + '&lat=' + lat + '&lon=' + lon

    })
  },
  goAdd: function (res) {
    console.log(res);
    wx.navigateTo({
      url: '/pages/addNew/addNew'
    })
  }
})