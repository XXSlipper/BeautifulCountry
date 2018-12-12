// pages/mine/myCollectNews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    selectedIndex:0,

    swiperH:0,

    minshengData:[],

    junshiData:[],

    chuangyeData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var util = require("../../utils/util.js")
    var lists = getApp().globalData.userCollectionList
    console.log(lists)
    for (var i = 0; i < lists.length; i++){
      var obj = lists[i]
      if(obj.hasChange == undefined){
        obj.time = util.changeTimeNumToTimeAgo(obj.time)
        obj["hasChange"] = true
      }
      if(obj.type === "minsheng"){
        this.data.minshengData.push(obj)
      }else if (obj.type === "junshi"){
        this.data.junshiData.push(obj)
      }else if (obj.type === "chuangye"){
        this.data.chuangyeData.push(obj)
      }else{

      }
    }

    this.setData({
      minshengData: this.data.minshengData,
      junshiData: this.data.junshiData,
      chuangyeData: this.data.chuangyeData
    })


    this.setSwiperH(0)
  },

  setSwiperH:function(index){
    var miniH = wx.getSystemInfoSync().windowHeight - 40

    var contentH = 0
    if(index == 0){

    }else if(index == 1){

    }else{

    }

    this.setData({ swiperH: contentH > miniH ? contentH : miniH})
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

  clickedOnSeg: function(e){
    var index = e.currentTarget.dataset.index
    this.setData({selectedIndex: index})
  },

  listSwiperChange:function(e){
    var index = e.detail.current
    this.setData({ selectedIndex: index })
  },

  clickOnNewsCell:function(e){
    var articleId = e.currentTarget.dataset.articleId
    wx.navigateTo({
      url: '../home/newsDetail?articleId=' + articleId,
    })
  }
})