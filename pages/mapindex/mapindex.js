const app = getApp()

Page({
  data: {
    latitude:"",
    longitude:""
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
            self.latitude = res.latitude;
            self.longitude = res.longitude;
            self.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: ress.data.markers,
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#673bb7',
                fillColor: '#d1edff88',
                radius: 15,//定位点半径
                strokeWidth: 1
              }]
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
  regionchange(e) {
    console.log(e)
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      console.log(e)
      var that = this;
      this.mapCtx = wx.createMapContext("myMap");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (res) {
          console.log(res)
          that.latitude = res.latitude;
          that.longitude = res.longitude;
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            circles: [{
              latitude: res.latitude,
              longitude: res.longitude,
              color: '#673bb7',
              fillColor: '#d1edff88',
              radius: 15,//定位点半径
              strokeWidth: 1
            }]
          })
        }
      })
    }
  },
  //定位到自己的位置事件
  my_location: function (e) {
    var that = this;
    that.onLoad();
  },
  onShow:function(){
    this.onLoad();
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
    var that=this;
    console.log(res);
    wx.navigateTo({
      url: '/pages/addNew/addNew?lat=' + that.latitude + '&lon=' + that.longitude
    })
  }
})