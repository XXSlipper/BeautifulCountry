// pages/home/searchQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    searchBarContainerW:0,
    searchKey:"",
    inputValue:"",


    networkState: -2,

    questionData: [],

    currentPage: -1,

    isloadingListOver: false,

    isLoadingMoreList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var query = wx.createSelectorQuery()
    query.select('.searchLabelContainer').boundingClientRect(function (rect) {
      self.setData({
        searchBarContainerW: rect.width - 32
      })
    }).exec()
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

    this.loadData(page, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  blurAction:function(){
    this.setData({
      inputValue:this.data.searchKey
    })
  },

  inputAction:function(e){
    this.data.inputValue = e.detail.value
  },

  confirmAction:function(){

    this.data.searchKey = this.data.inputValue
    this.data.questionData = []
    this.loadData(0,false);
  },

  loadData: function (page, isReachBottom){
    if (this.data.networkState == -1) {
      return
    }

    if (isReachBottom == false) {
      wx.showLoading({
        title: '加载中...',
      })
    }

    this.data.networkState = -1

    var searchKey = this.data.searchKey


    var networkH = require("../../utils/networkHandle.js")
    var self = this
    networkH.getQuestionList({
      searchKey: searchKey,
      page: page,
      success: function (e) {
        
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

        self.setData({ 
          questionData: newQuestionList, 
          networkState: 1 
        })
      },
      fail: function (e) {

        if (isReachBottom == false) {
          wx.hideLoading()
        }

        self.data.networkState = 0

        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png",
          duration: 1500
        })

      }
    })

  }


})