// pages/mine/userMoreCollectList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    collectMinshengData:[],
    collectJunshiData:[],
    collectChuangyeData:[],

    showData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var myType = options.type

    if(myType === "minsheng"){
      wx.setNavigationBarTitle({
        title: '民生',
      })
    }else if (myType === "junshi"){
      wx.setNavigationBarTitle({
        title: '军事',
      })
    }else if (myType === "chuangye"){
      wx.setNavigationBarTitle({
        title: '创业致富',
      })
    }

    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getCollectArticleList({
      userId : options.userId,
      success:function(e){
        wx.hideLoading()

        for(var i = 0; i < e.data.length; i++){
          var obj = e.data[i]
          if (obj.type === "minsheng"){
            self.data.collectMinshengData.push(obj)
          } else if (obj.type === "junshi"){
            self.data.collectJunshiData.push(obj)
          } else if (obj.type === "chuangye"){
            self.data.collectChuangyeData.push(obj)
          }
        }
        if (myType === "minsheng") {
          self.data.showData = self.data.collectMinshengData
        } else if (myType === "junshi") {
          self.data.showData = self.data.collectJunshiData
        } else if (myType === "chuangye") {
          self.data.showData = self.data.collectChuangyeData
        }
        self.setData({
          showData: self.data.showData
        })
      },
      fail:function(e){
        wx.hideLoading()
        wx.showToast({
          title: '获取失败',
          image:"../../images/mine/fail.png",
          duration:1500
        })
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

  clickOnNewsCell:function(e){
    var articleId = e.currentTarget.dataset.articleId
    wx.navigateTo({
      url: '../home/newsDetail?articleId=' + articleId,
    })
  }
})