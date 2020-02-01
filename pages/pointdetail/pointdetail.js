// pages/pointdetail/pointdetail.js
var app = getApp()
var timer; 

var mydata = {
  end: 0,
  replyUserName: "",
  limit: 6
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: {},
    lat:"",
    lon:"",
    name:"",
    helpopenid:"",
    markerarray:[],
    markerId:"",
    filmDetail: {},
    showLoading: false,
    imagesshow:[],
    paurl:"https://rainbowman.goho.co",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.data.markerId = options.markerId;
    if (options.markerarray) {
      this.data.markerarray = JSON.parse(options.markerarray);
      this.fordo(this.data.markerarray, this.data.markerId);
    } else {
      this.data.markers = JSON.parse(options.markers);
      this.fordo(this.data.markers, this.data.markerId);
    }

    mydata.sourceId = options.markerId;
    mydata.commentId = "";
    mydata.replyopenid="";
    mydata.replyUserName = "";
    //设置scroll的高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight:'85vh',
          userId: app.globalData.userId
        });
      }
    });
    mydata.page = 1;
    that.getPageInfo(mydata.page);

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
  // 更新页面信息
  // 此处的回调函数在 传入新值之前执行 主要用来清除页面信息
  getPageInfo(page, callback) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log("getPageInfo");
    console.log("page" + page);
    var limited = mydata.limit;
    wx.request({
      url: app.globalData.paurl + '/WXIndex/getComment',
      method: "POST",
      data: {
        sourceId: mydata.sourceId,
        pageSize: limited,
        pageNum: page
      },
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      success: res => {
        console.log(res);
        if (page == 1) {
          that.data.list = res.data;
          var nocomment=false;
          var scrollhe ="85vh";
          if (typeof res.data == 'string' || res.data.length<1){
            nocomment=true;
            scrollhe = "15vh";
            that.data.list=[];
          }
          that.setData({
            list: that.data.list,
            nocomment: nocomment,
            scrollHeight: scrollhe
          })
          mydata.end = 0;
        } else {
          // 当前页为其他页
          var list = that.data.list;
          if (res.data.length != 0) {
            list = that.addArr(list, res.data);
            that.setData({
              list: list
            })
            mydata.end = 0;
          } else {
            mydata.end = 1;
          }
        }
        wx.hideLoading();
      }
    })
  },
  onPullDownRefresh: function () {
   this.refresh();
    wx.stopPullDownRefresh();
  },
  submitForm(e) {
    var form = e.detail.value;
    var that = this;
    if (form.comment == "") {
      util.showLog('请输入评论');
      return;
    }
    wx.showLoading({
      title: '提交中',
    })
    // 提交评论
    wx.request({
      url: app.globalData.paurl + '/WXIndex/insertComment',
      method: "POST",
      data: {
        sourceId: mydata.sourceId,
        comment: form.comment,
        userId: app.globalData.userId,
        replyCommentId: mydata.commentId,
        replyopenid: mydata.replyopenid,
        helpopenid: that.data.helpopenid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        //token: app.globalData.token
      },
      success: res => {
        console.log(res)
        if (res.data.success) {
          wx.hideLoading();
          wx.showToast({
            title: "回复成功"
          })
          that.refresh();
          mydata.commentId = "";
          mydata.replyopenid="";
          mydata.replyUserName = "";
          this.setData({
            replyUserName: mydata.replyUserName,
            reply: false,
            formshow: false
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '回复失败，请检查您的网络',
          })
        }
      }
    })
  },
  /**
* 页面下拉刷新事件的处理函数
*/
  refresh: function () {
    console.log('refresh');
    mydata.page = 1
    this.getPageInfo(mydata.page, function () {
      this.setData({
        list: []
      })
    });
    mydata.end = 0;
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  bindDownLoad: function () {
    console.log("onReachBottom");
    var that = this;
    if (mydata.end == 0) {
      mydata.page++;
      that.getPageInfo(mydata.page);
    }
  },
  bindReply: function (e) {
    console.log(e);
    mydata.commentId = e.target.dataset.commentid;
    mydata.replyUserName = e.target.dataset.commentusername;
    mydata.replyopenid = e.target.dataset.openid;
    this.setData({
      replyUserName: mydata.replyUserName,
      reply: true,
      formshow:true
    })
  },
  commentReply: function (e) {
    this.setData({
      formshow: true
    })
  },
  // 合并数组
  addArr(arr1, arr2) {
    for (var i = 0; i < arr2.length; i++) {
      arr1.push(arr2[i]);
    }
    return arr1;
  },
  deleteComment: function (e) {
    console.log(e);
    var that = this;
    var commentId = e.target.dataset.commentid;

    wx.showModal({
      title: '删除评论',
      content: '请确认是否删除该评论？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.paurl + '/WXIndex/deleteComment2',
            method: "POST",
            data: {
              commentId: commentId
            },
            header: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            success: res => {
              that.refresh();
              wx.showToast({
                title: "删除成功"
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  cancleReply: function (e) {
    mydata.commentId = "";
    mydata.replyUserName = "";
    mydata.replyopenid="";
    this.setData({
      replyUserName: mydata.replyUserName,
      reply: false,
      formshow: false
    })
  },


  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.filmDetail.imagess// 需要预览的图片http链接列表  
    })
  },
  goto: function () {
    let lat = parseFloat(this.data.lat);
    let lon = parseFloat(this.data.lon);
    let name = this.data.name;
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  fordo: function (markers, markerId){
    var flag=false;
    var object = this.data.filmDetail;
    var that=this;
    var images = "", description = "", user = "", location = "";
    var imagess = new Array();
    var resultimagess = new Array();
    for(let item of markers) {
      if (item.id == markerId) {
        flag=true;
        this.data.lat = item.latitude;
        this.data.lon = item.longitude;
        this.data.name = item.needtitle;
        this.data.helpopenid = item.helpopenid;
        images = item.needimages;
        imagess = images.split(",");
        for (var j = 0, len = imagess.length; j < len; j++) {
          resultimagess.push(app.globalData.paurl + '/WXIndex/getImages?imgurl=' + imagess[j]);
        }
        that.imagesshow = resultimagess;
        object.imagess = resultimagess;
        object.location = item.needlocation;
        object.images = app.globalData.paurl + '/WXIndex/getImages?imgurl=' + imagess[0];
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
    if (!flag){
      var object = this.data.filmDetail;
      object.user = "用户已删除该条记录";
      object.good = "用户已删除该条记录";
      object.title = "用户已删除该条记录";
      that.setData({
        filmDetail: object,
        showLoading: false
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this
    return {
      title: '转发',
      path: '/pages/pointdetail/pointdetail?markers=' + JSON.stringify(that.data.markers) + '&markerId=' + that.data.markerId,
      success: function (res) { }
    }
  },
  onPageScroll: function (e) {
  /**  if (e.scrollTop < 0) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } **/
  },
  
})
