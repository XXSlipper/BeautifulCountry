// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    allUser:
    [
      {
        name:"大牛",
        iconUrl:"../../images/testImages/test2.png",
        userID:"",
        detailInfo:"大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      },
      {
        name: "大牛",
        iconUrl: "../../images/testImages/test2.png",
        userID: "",
        detailInfo: "大米|小麦|柑橘|拖拉机"
      }
    ]
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

  blurAction: function () {
    this.setData({ moveGlassPositon_x: 74 })
  },

  focusAction: function () {
    this.setData({ inputValue: "", moveGlassPositon_x: 0})
  },

  confirmAction: function () {

  },

  inputAction: function (e) {
    this.setData({ inputValue: e.detail.value })
  }

})