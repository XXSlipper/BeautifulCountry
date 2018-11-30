// pages/home/answerQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId:"",
    inputValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.questionId = options.questionId
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
  inputAction:function(e){
    this.data.inputValue = e.detail.value
  },

  sendAnswer:function(e){
    var content = this.data.inputValue

    if(content.length == 0){
      wx.showToast({
        title: "内容不能未空",
        icon:"none",
        duration:2000
      })
      return
    }

    wx.showLoading({
      title: '提交中...',
    })
    var questionId = this.data.questionId
    var networkH = require("../../utils/networkHandle.js")
    networkH.answerQuestion({
      questionId: questionId,
      content: content,
      success:function(p){
        wx.hideLoading()
        wx.showToast({
          title: p.successMsg,
          image: "../../images/mine/success.png",
          duration: 1500
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1600)
      },
      fail:function(p){
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }
    })
  }
})