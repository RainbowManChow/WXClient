var app = getApp()
Page({
  data: {
    latitude: "",
    longitude: "",
    topText: ' 欢迎来到RainbowMan',
    markers: "",
    markid: "",
    filmDetail: {},
    markerob:{},
    msgnew:false
  },
getauth:function(num){
  console.log("copy?");
  const promise = new Promise((resolve, reject) => {
  wx.getSetting({
    success: (res) => {
      //判断用户没有授权，默认弹出授权框
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          success(res) {
            wx.showToast({ //这里提示失败原因
              title: '授权成功！',
              duration: 1500
            })
            resolve(res);
          },
          fail(res) {
            wx.showModal({
              content: '检测到您没打开位置，是否去设置打开？',
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                console.log(res);
                //点击“确认”时打开设置页面
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      resolve(res);
                     }
                  })
                } else {
                  console.log('用户点击取消');
                  reject(res);
                }
              }
            });
          }
        })
      }else{
        resolve(res);
      }
    },
    fail: function () {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
      reject(res);
    }
  });
  });
  var self = this;
  promise.then(res => {
    if(num=='2'){
      wx.navigateTo({
        url: '/pages/addNew/addNew?lat=' + self.latitude + '&lon=' + self.longitude
      })
    }else{
      self.mapCtx = wx.createMapContext('myMap');
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
              if (app.globalData.socketStatus === 'closed') {
                app.openSocket();
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
      })
    }
   
  }, err => {
    console.log(err);
    wx.showToast({
      title: '授权失败,点击下方增加按钮设置以方便使用',
      icon: 'none',
      duration: 3500,
    });
    return;
  })
},
onLoad:function(){
  
 
},
  onReady: function (option) {
    app.globalData.mapindexJS = this
    this.getauth();
  },
  onPullDownRefresh: function () {
    this.onReady();
    wx.stopPullDownRefresh();
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
    that.onReady();
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
  toMsg: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/receninfo/recentmsg'
    })
  },
  onShow: function () {
   // this.getauth();
   // this.onReady();
    if (app.globalData.socketStatus === 'closed') {
      app.openSocket();
    }
  },
  gotohere: function (res) {
    let markerId = res.markerId;// 获取点击的markers  id
    let markers = res.currentTarget.dataset.markers;
    this.data.markerob = markers;
    this.data.markid = markerId;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0,
    })
    this.animation = animation;
    animation.translateY(300).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      imageone: true,
      imagethree: true,
    });
    this.fordo(markers, markerId);
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200);
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading();
    }.bind(this), 200)
  },
  hideModal: function (res) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  godetail:function(){
    let lat = ''; // 获取点击的markers经纬度
    let lon = ''; // 获取点击的markers经纬度
    let name = ''; // 获取点击的markers名称
    let markerId = this.data.markid;// 获取点击的markers  id
    let markers = this.data.markerob;
    wx.navigateTo({
      url: '/pages/pointdetail/pointdetail?markers=' + JSON.stringify(markers) + '&markerId=' + markerId + '&lat=' + lat + '&lon=' + lon
    })
  },
  fordo: function (markers, markerId) {
    var flag = false;
    var object = this.data.filmDetail;
    var that = this;
    var images = "", description = "", user = "", location = "";
    var imagess = new Array();
    var resultimagess = new Array();
    for (let item of markers) {
      if (item.id == markerId) {
        flag = true;
        this.data.lat = item.latitude;
        this.data.lon = item.longitude;
        this.data.name = item.needtitle;
        images = item.needimages;
        imagess = images.split(",");
        for (var j = 0, len = imagess.length; j < len; j++) {
          resultimagess.push(app.globalData.paurl + '/WXIndex/getImages?imgurl=' + imagess[j]);
        }
        that.imagesshow = resultimagess;
        object.imagess = resultimagess;
        object.location = item.needlocation;
        object.images = app.globalData.paurl + '/WXIndex/getImages?imgurl=' + imagess[0];
        object.time = item.needrecentdate;
        object.name = item.needtitle;
        var imagetwo=false;
        if (resultimagess.length>1){
          object.imagestwo = app.globalData.paurl + '/WXIndex/getImages?imgurl=' + imagess[1];
          imagetwo=true;
        }
        that.setData({
          object: object,
          imagetwo: imagetwo
        });
      }
      }
      },

  goAdd: function (res) {
    this.getauth(2);
  }
})