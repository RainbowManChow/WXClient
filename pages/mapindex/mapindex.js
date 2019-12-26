var app = getApp()
Page({
  data: {
    latitude: "",
    longitude: "",
    topText: ' 欢迎来到RainbowMan',
    markers: "",
    markid: "",
  },
  onLoad: function (option) {
    console.log("haha：" + undefined == option ? "" : option);
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
            //   self.data.markers = markers;
            self.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: ress.data.markers,
              userInfo: app.globalData.userInfo
              /**    circles: [{
                    latitude: res.latitude,
                    longitude: res.longitude,
                    color: '#673bb7',
                    fillColor: '#d1edff88',
                    radius: 15,//定位点半径
                    strokeWidth: 1
                  }] **/
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

  //转发
  onShareAppMessage: function (res) {
    var userid = app.globalData.userid;
    if (res.from === 'button') { }
    return {
      title: '转发',
      path: '/pages/mapindex/mapindex?from_uid=' + userid,
      success: function (res) { }
    }
  },
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        //选择地点之后返回的结果
      },
      fail: function (err) {
        console.log(err)
      }

    });

  },
  regionchange(e) {
    //this.moveToLocation();
    //console.log(e)
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
            /**     circles: [{
                 latitude: res.latitude,
                 longitude: res.longitude,
                 color: '#673bb7',
                 fillColor: '#d1edff88',
                 radius: 15,//定位点半径
                 strokeWidth: 1
               }] **/
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
  unfinished() {
    wx.showToast({
      title: '敬请期待',
      icon: "none"
    })
  },
  toUser: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/userCenter/userCenter?markers=' + that.data.markers
    })
  },
  onShow: function () {
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
    var that = this;
    console.log(res);
    wx.navigateTo({
      url: '/pages/addNew/addNew?lat=' + that.latitude + '&lon=' + that.longitude
    })
  }
})