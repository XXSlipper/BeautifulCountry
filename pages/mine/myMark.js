// pages/mine/myMark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    allUsers: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var focusList = getApp().globalData.userFocusList
    this.setData({ allUsers: focusList })
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

  cancelFocusAction: function(e){
    var focusId = e.currentTarget.dataset.focusId
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定取消关注该用户?',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '取消中...',
          })
          var networkH = require("../../utils/networkHandle.js")
          networkH.cancelFocus({
            focusId: focusId,
            success: function (p) {
              wx.hideLoading()

              var focusList = getApp().globalData.userFocusList
              for (var i = 0; i < focusList.length; i++) {
                var obj = focusList[i]
                if (obj.focusId == focusId) {
                  focusList.splice(i, 1)
                  break
                }
              }

              self.setData({ allUsers: focusList })

              wx.showToast({
                title: p.successMsg,
                image: "../../images/mine/success.png",
                duration: 2000
              })
            },
            fail: function (p) {
              wx.hideLoading()
              wx.showToast({
                title: p.errorMsg,
                image: "../../images/mine/fail.png",
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  clickedCellAction:function(e){

    var userId = e.currentTarget.dataset.userId

    wx.navigateTo({
      url: 'userDetailInfo?userId=' + userId
    })

  }
})