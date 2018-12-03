// pages/mine/myCollectQuestions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    networkState:-2,

    currentPage:-1,

    questionData:[],

    isloadingListOver:false,

    isLoadingMoreList:false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  loadQuestion:function(page,isReachBottom){
    if(this.data.networkState == -1){
      return
    }
    
    if(isReachBottom == false){
      wx.showLoading({
        title: '加载中...',
      })
    }

    this.data.networkState = -1

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.userMarkQuestionList({
      page:page,
      userId: getApp().globalData.userInfo.userID,
      success:function(e){
        if (isReachBottom == false) {
          wx.hideLoading()
        }
        self.data.currentPage = page

        if (e.data.list.length == 0) {
          self.data.isloadingListOver = true
          if (isReachBottom) {
            self.setData({ isloadingListOver: true })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        } else {
          self.data.isloadingListOver = false
          if (isReachBottom) {
            self.setData({ isloadingListOver: false })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        }
        var newQuestionList = self.data.questionData.concat(e.data.list)

        self.setData({ questionData: newQuestionList, networkState:1})
      },
      fail:function(p){
        if(isReachBottom == false){
          wx.hideLoading()
        }

        self.data.networkState = 0

        wx.showToast({
          title: p.errorMsg,
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
    this.loadQuestion(0, false)
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

    if (this.data.isloadingListOver) {
      this.setData({ isLoadingMoreList: true, isloadingListOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreList: false })
      }, 1500)

      return
    }

    this.setData({ isLoadingMoreList: true, isloadingListOver: false })

    var page = this.data.currentPage + 1

    this.loadQuestion(page, true)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tapOnQuestionCell: function (e) {
    var questionId = e.currentTarget.dataset.questionId
    wx.navigateTo({
      url: '../home/questionDetail?questionId=' + questionId,
    })
  }

})