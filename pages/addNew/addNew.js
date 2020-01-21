var app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'AS6BZ-SH2KX-LRW44-TKU6J-2PRE7-45FKL'//申请的开发者秘钥key
});

Page({
  data: {
    img_url: [],
    content: '',
    currentlocation:'当前位置',
    latitude:'',
    longitude:'',
    location:'',
    title:''
      },
  onLoad: function (options) {
    this.data.latitude= options.lat;
    this.data.longitude = options.lon;
    var that=this;
    //小程序api获取当前坐标
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
       // that.data.latitude = res.latitude;
        //that.data.longitude = res.longitude;
        console.log(res)
        // 调用sdk接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function (res) {
            //获取当前地址成功
            console.log(res);
            that.data.location = res.result.address;
            that.setData({
              currentlocation: res.result.address           
            });
          },
          fail: function (res) {
            console.log('获取当前地址失败');
            that.setData({
              currentlocation: '获取当前位置错误'
            });
          }
        });
      },
    })

  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh
  },
  input: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  // 删除图片
  deleteImg: function (e) {
    let img_url = this.data.img_url;
    var index = e.currentTarget.dataset.index;
    img_url.splice(index, 1);
    that.setData({
      img_url: img_url
    })
  },
  
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },
  //发布按钮事件
  send: function () {
    if (this.data.img_url.length<1){
      wx.showToast({
        title: '至少一张图片',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (this.data.title==''){
      wx.showToast({
        title: '请填写标题',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    var that = this;
    var user_id = app.globalData.userId;
    wx.showLoading({
      title: '上传中',
    })
    that.img_upload()
  },
  //图片上传
  img_upload: function () {
    let that = this;
    let img_url = that.data.img_url;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: app.globalData.paurl + '/WXIndex/fileUpload',
        filePath: img_url[i],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          'user': 'test'
        },
        success: function (res) {
          console.log('上传成功');
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(res.data)
          //如果全部传完，则可以将图片路径保存到数据库
          if (img_url_ok.length == img_url.length) {
            var userid = app.globalData.userId;
            var content = that.data.content;
            var title = that.data.title;
            wx.request({
              url: app.globalData.paurl + '/WXIndex/saveInfo',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: {
                user_id: userid,
                images: img_url_ok,
                content: content,
                title: title,
                latitude: that.data.latitude,
                longitude:that.data.longitude,
                location:that.data.location
              },
              success: function (res) {
                if (res.data.status == 0) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提交成功',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/mapindex/mapindex',
                        })
                      }
                    }
                  })
                }else{
                  wx.hideLoading();
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        },
        fail: function (res) {
          console.log('上传失败');
          wx.hideLoading();
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})