// pages/mine/myCollect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectArticleCount:0,
    collectQuestionCount:0,
    collectSupplyDemandCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      collectArticleCount: options.collectArticleCount,
      collectQuestionCount: options.collectQuestionCount,
      collectSupplyDemandCount: options.collectSupplyDemandCount
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

  clickedCell:function(e){
    var index = e.currentTarget.dataset.index
    switch(index){
      case 0 :{
        wx.navigateTo({
          url: 'myCollectNews'
        })
      }
      break
      case 1 :{
        wx.navigateTo({
          url: 'myCollectQuestions'
        })
      }
      break
      case 2:{
        wx.navigateTo({
          url: 'myCollectBuyAndPay'
        })
      }
      break
    }
  }
})