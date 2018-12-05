// pages/mine/myRelease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseQuestionCount:0,
    releaseDemandSupplyCount:0,
    releaseJobCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var releaseDemandSupplyCount = parseInt(options.releaseDemandCount) + parseInt(options.releaseSupplyCount)
    this.setData({
      releaseQuestionCount: options.releaseQuestionCount,
      releaseJobCount: options.releaseJobCount,
      releaseDemandSupplyCount: releaseDemandSupplyCount
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

  clickedCell: function (e) {
    var index = e.currentTarget.dataset.index
    switch (index) {
      case 0: {
        wx.navigateTo({
          url: 'myReleaseQuestion'
        })
      }
        break
      case 1: {
        wx.navigateTo({
          url: 'myReleaseSupplyAndRemand'
        })
      }
        break
      case 2: {
        wx.navigateTo({
          url: 'myReleaseJob'
        })
      }
        break
    }
  }

})