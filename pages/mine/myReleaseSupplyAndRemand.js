// pages/mine/myReleaseSupplyAndRemand.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    selectedIndex: 0,

    swiperH: 0,

    networkStates: [-2, -2],

    loadOverFlags: [false, false],

    isloadingListOver: false,

    isLoadingMoreList: false,

    supplyPage: -1,
    supplyData: [],

    remandPage: -1,
    remandData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  setSwiperH: function (index) {
    var miniH = 980

    var contentH = 0

    if (this.data.selectedIndex == 0) {

      contentH = (460 + 40) * Math.ceil(this.data.supplyData.length) + 40

    } else {
      contentH = (165 + 30) * this.data.remandData.length + 30
    }

    this.setData({ swiperH: contentH > miniH ? contentH : miniH })
  },

  loadData: function (index, page, isReachBottom) {

    if (this.data.networkStates[index] == -1) {
      return
    }

    var comparePage = (index == 0 ? this.data.supplyPage : this.data.remandPage)
    if (page <= comparePage) {
      this.setSwiperH(index)
      return
    }

    if (isReachBottom == false) {
      wx.showLoading({
        title: '加载中...',
      })
    }

    this.data.networkStates[index] = -1

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getBuyAndSellList({
      page: page,
      userId: getApp().globalData.userInfo.userID,
      type: (index == 0 ? "supply" : "demand"),
      success: function (e) {
        if (isReachBottom == false) {
          wx.hideLoading()
        }
        self.data.networkStates[index] = 1
        if (index == 0) {
          self.data.supplyPage = page
        } else {
          self.data.remandPage = page
        }

        if (e.data.list.length == 0) {
          self.data.loadOverFlags[index] = true
          if (isReachBottom) {
            self.setData({ isloadingListOver: true })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        } else {
          self.data.loadOverFlags[index] = false
          if (isReachBottom) {
            self.setData({ isloadingListOver: false })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        }

        if (index == 0) {
          for (var i = 0; i < e.data.list.length; i++) {
            var obj = e.data.list[i]
            if (i % 2 == 0) {
              var subArr = []
              subArr.push(obj)
              self.data.supplyData.push(subArr)
            } else {
              var lastSubArr = self.data.supplyData[self.data.supplyData.length - 1]
              lastSubArr.push(obj)
            }
          }
          self.setData({ supplyData: self.data.supplyData })
        } else {

          var util = require("../../utils/util.js")
          for (var i = 0; i < e.data.list.length; i++) {
            var obj = e.data.list[i]
            obj.createTime = util.formatTimeNumber(obj.createTime, 'Y年M月D日')
            self.data.remandData.push(obj)
          }

          self.setData({ remandData: self.data.remandData })

        }

        self.setSwiperH(index)

      },
      fail: function (e) {

        if (isReachBottom == false) {
          wx.hideLoading()
        }

        self.data.networkStates[index] = 0

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
    this.data.supplyPage = -1
    this.data.remandPage = -1
    this.data.supplyData = []
    this.data.remandData = []
    var index = this.data.selectedIndex
    this.loadData(index, 0, false)
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
    var index = this.data.selectedIndex
    if (this.data.loadOverFlags[index]) {
      this.setData({ isLoadingMoreList: true, isloadingListOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreList: false })
      }, 1500)

      return
    }

    this.setData({ isLoadingMoreList: true, isloadingListOver: false })

    if (index == 0) {
      var page = this.data.supplyPage + 1
      this.loadData(index, page, true)
    } else {
      var page = this.data.remandPage + 1
      this.loadData(index, page, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickedOnSeg: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({ selectedIndex: index })
    this.loadData(index, 0, false)
  },

  listSwiperChange: function (e) {
    var index = e.detail.current
    this.setData({ selectedIndex: index })
    this.loadData(index, 0, false)
  },

  clickedOnSupply: function (e) {
    var supplyDemandId = e.currentTarget.dataset.supplyDemandId
    wx.navigateTo({
      url: 'editeMySupplyAndRemand?supplyDemandId=' + supplyDemandId + "&isSupply=1",
    })
  },

  clickedOnBuyCell: function (e) {
    var supplyDemandId = e.currentTarget.dataset.supplyDemandId
    wx.navigateTo({
      url: 'editeMySupplyAndRemand?supplyDemandId=' + supplyDemandId + "&isSupply=0",
    })
  }

})