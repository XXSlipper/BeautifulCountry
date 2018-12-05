// pages/mine/myReleaseJob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    networkState:-1,
    workDataPage: -1,
    workData: [],
    isloadingListOver: false,
    isLoadingMoreList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  loadData:function(page,isReachBottom){

    var workState = this.data.networkState

    if (workState == -2) {
      return
    }

    if (page <= this.data.workDataPage) {
      return
    }

    if (isReachBottom == false) {
      wx.showLoading({
        title: '加载中...'
      })
    }

    this.data.networkState = -2//将标识设置为请求中
    var self = this
    var networkH = require("../../utils/networkHandle.js")

    networkH.getJobList({
      page: page,
      userId: getApp().globalData.userInfo.userID,
      success: function (e) {

        self.data.workDataPage = page
        self.data.networkState = 1//将标识设置为成功

        if (isReachBottom == false) {
          wx.hideLoading()
        }

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

        var newWorkData = self.data.workData.concat(e.data.list)

        self.setData({ workData: newWorkData })

      },
      fail: function (e) {

        if ( isReachBottom == false) {
          wx.hideLoading()
        }


        if (isReachBottom) {
          self.setData({ isLoadingMoreList: false })
        }

        self.data.networkState = 0//将标识设置为失败

        wx.showToast({
          title: e.errorMsg,
          image: "../../images/mine/fail.png",
          duration: 1500
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

    this.data.networkState = -1
    this.data.workDataPage = -1
    this.data.workData = []
    this.data.isloadingListOver = false
    this.data.isLoadingMoreList = false

    this.loadData(0,false)

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

    var page = this.data.workDataPage + 1

    this.loadData(page, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  editWork:function(e){
    var index = e.currentTarget.dataset.index
    var job = this.data.workData[index]
    var jobStr = JSON.stringify(job)
    wx.navigateTo({
      url: 'editeMyReleaseJob?jobStr=' + jobStr
    })
  }
})