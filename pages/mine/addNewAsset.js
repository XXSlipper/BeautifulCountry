// pages/mine/addNewAsset.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selecteIndex: { x: 0, y: 0, z: 0 },
    xlist: {},
    ylist: {},
    zlist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var e = this.data.selecteIndex
    this.loadDataWithSelecteIndex(e)
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
  loadDataWithSelecteIndex: function (e) {

    var assetHandle = require("../../utils/assetsHandle.js")
    var xlist = assetHandle.getListX()
    var xcode = xlist["code"][e.x]
    var ylist = assetHandle.getListYWithXcode(xcode)
    var ycode = ylist["code"][e.y]
    var zlist = assetHandle.getListZWithYcode(ycode)

    this.setData({ xlist: xlist, ylist: ylist, zlist: zlist, selecteIndex: e })

  },

  clickOnXlistCell: function (e) {
    var x = e.currentTarget.dataset.index
    var selecteIndex = { x: x, y: 0, z: 0 }
    this.loadDataWithSelecteIndex(selecteIndex)
  },

  clickOnYlistCell: function (e) {
    var x = this.data.selecteIndex.x
    var y = e.currentTarget.dataset.index
    var selecteIndex = { x: x, y: y, z: 0 }
    this.loadDataWithSelecteIndex(selecteIndex)
  },

  clickOnZlistCell: function (e) {
    var x = this.data.selecteIndex.x
    var y = this.data.selecteIndex.y
    var z = e.currentTarget.dataset.index
    var selecteIndex = { x: x, y: y, z: z }
    this.loadDataWithSelecteIndex(selecteIndex)
  },



  sureSelecte: function () {

    var name = this.data.zlist["name"][this.data.selecteIndex.z]
    var code = this.data.zlist["code"][this.data.selecteIndex.z]

    wx.showLoading({
      title: '添加中...',
    })

    var networkHandle = require("../../utils/networkHandle.js")
    networkHandle.addNewAsset({
      name: name,
      code: code,
      success:function(e){
        wx.hideLoading()
        wx.showToast({
          title: e.successMsg,
          image: "../../images/mine/success.png",
          duration: 1500
        })
      },
      fail:function(e){
        wx.hideLoading()
        wx.showToast({
          title: e.errorMsg,
          image:"../../images/mine/fail.png",
          duration:1500
        })
      }
    })
  }

})