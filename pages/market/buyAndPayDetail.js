// pages/market/buyAndPayDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    interval: 2000,
    duration: 500,

    isSupply:true,

    supplyDemandId:0,

    listTitles:[],

    listValues:[],

    detailInfo: {}//userPhone userId

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.isSupply = options.isSupply == 1 ? true : false
    
    this.data.supplyDemandId = options.supplyDemandId

    if(this.data.isSupply){
      this.data.listTitles = ["供应产品","发布时间","供应数量","供应价格","他的位置"]
    }else{
      this.data.listTitles = ["求购产品", "发布时间", "求购数量", "求购价格", "他的位置"]
    }

    this.setData({ listTitles: this.data.listTitles, isSupply: this.data.isSupply})

    var self = this

    wx.setNavigationBarTitle({
      title: self.data.isSupply ? "供应详情" : "求购详情",
    })

    wx.showLoading({
      title: '加载中...',
    })
    var networkH = require("../../utils/networkHandle.js")
    networkH.supplyDemandDetail({
      supplyDemandId:self.data.supplyDemandId,
      success:function(e){
        wx.hideLoading()
        var info = e.data
        if (info.images){
          info.images = info.images.split(",")
        }else{
          info.images = ["../../images/market/noImage.png"]
        }
        var util = require("../../utils/util.js")
        info.createTime = util.formatTimeNumber(info.createTime,"Y年M月D日")
        var listValues = []
        listValues[0] = info.goodsType
        listValues[1] = info.createTime
        listValues[2] = info.goodsNum + info.unit
        listValues[3] = info.goodsPrice + "/" + info.unit
        listValues[4] = info.locationName
        self.setData({ listValues: listValues, detailInfo: info})
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

  showImgDetail: function(e){
    if (this.data.detailInfo.images[0] === "../../images/market/noImage.png"){
      return
    }
    var self = this
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: self.data.detailInfo.images,
      current: self.data.detailInfo.images[index]
    })
  },

  focusGoodsAction:function(e){
    var focusStatus = this.data.detailInfo.focusStatus
    if (focusStatus == undefined) {
      return
    }
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    if (focusStatus == true) {
      wx.showLoading({
        title: '取消中...',
      })
      networkH.supplyDemandCancelFocus({
        supplyDemandId: self.data.supplyDemandId,
        success: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.successMsg,
            image: '../../images/mine/success.png',
            duration: 1500
          })
          self.data.detailInfo.focusStatus = false
          self.setData({ detailInfo: self.data.detailInfo })
        },
        fail: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.errorMsg,
            image: '../../images/mine/fail.png',
            duration: 1500
          })
        }
      })
    } else {
      wx.showLoading({
        title: '收藏中...',
      })
      networkH.supplyDemandFocus({
        supplyDemandId: self.data.supplyDemandId,
        type: self.data.isSupply == true ? "supply" : "demand",
        success: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.successMsg,
            image: '../../images/mine/success.png',
            duration: 1500
          })
          self.data.detailInfo.focusStatus = true
          self.setData({ detailInfo: self.data.detailInfo })
        },
        fail: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.errorMsg,
            image: '../../images/mine/fail.png',
            duration: 1500
          })
        }
      })
    }
  },

  callPhone:function(e) {
    var self = this
    wx.makePhoneCall({
      phoneNumber: self.data.detailInfo.userPhone,
      success: function (p) {

      },
      fail: function (p) {

      }
    })
  },

  detailUserInfo:function(e){
    var userId = e.currentTarget.dataset.userId
    wx.navigateTo({
      url: '../mine/userDetailInfo?userId=' + userId,
    })
  }


})