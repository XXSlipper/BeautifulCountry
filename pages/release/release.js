// pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex: 0
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

  selecteAction : function(e) {

    let index = e.currentTarget.dataset.index
    if (index != this.data.selectedIndex){
      this.setData({ selectedIndex : index})
    }
  },

  continueAction : function (){

    if (getApp().globalData.userInfo == undefined) {
      wx.showModal({
        title: '提示',
        content: "授权登陆后才能进行发布,是否现在前往授权登陆?",
        success: function (res) {
          if (res.confirm) {//跳转我的界面
            wx.switchTab({
              url: '../mine/mine',
            })
          } else {//不处理
          }
        }
      })
      return
    }
    if (this.data.selectedIndex == 0){

      wx.navigateTo({
        url: 'question',
      })

    } else if (this.data.selectedIndex == 1){

      wx.navigateTo({
        url: 'work',
      })

    } else {

      wx.navigateTo({
        url: 'supply',
      })
    }

  }

})