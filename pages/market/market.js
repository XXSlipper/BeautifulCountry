// pages/market/market.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClickedSeg:false,
    oldScrollTop:0,

    stopOnTop:true,

    isLoadingMoreList: false,

    isloadingListOver: false,

    loadingOverFlags: [false, false, false, false, false],

    networkState: [{ state: -1 }, { state: -1 }, { state: -1 }],//-2 网络请求中, -1 未加载, 0 请求失败, 1请求成功

    segMoveViewH:40,
    segSelextedIndex:0,
    sortIndex:0,
    fillerIndex:{x:0,y:0,z:0},
    swiperH:150,
    segTitles: 
    [
        "供应",
        "求购",
        "工作"
    ],

    playDataPage:-1,
    playData: [], //[[{},{}],[{}]]

    buyDataPage:-1,
    buyData:[],

    workDataPage:-1,
    workData:[{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadListWithIndex(0,0,false,false)
  },

  loadListWithIndex:function(index,page,isPullDown,isReachBottom){
    var workState = this.data.networkState[index]
    if(workState == -2){
      if (isPullDown) {
        wx.stopPullDownRefresh()
      }
      this.setSwiperH()
      return
    }
    if(index == 0){

      if (page <= this.data.playDataPage){
        if (isPullDown) {
          wx.stopPullDownRefresh()
        }
        this.setSwiperH()
        return
      }

      if (isPullDown == false && isReachBottom == false) {
        wx.showLoading({
          title: '加载中...'
        })
      }

      this.data.networkState[index].state = -2//将标识设置为请求中
      var self = this
      var networkH = require("../../utils/networkHandle.js")
      networkH.getBuyAndSellList({
        page: page,
        type: "supply",
        success: function (e) {

          self.data.playDataPage = page
          self.data.networkState[index].state = 1//将标识设置为成功

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }

          if (e.data.list.length == 0) {
            self.data.loadingOverFlags[index] = true
            if (isReachBottom) {
              self.setData({ isloadingListOver: true })
              setTimeout(function () {
                self.setData({ isLoadingMoreList: false })
              }, 1500)
            }
          } else {
            self.data.loadingOverFlags[index] = false
            if (isReachBottom) {
              self.setData({ isloadingListOver: false })
              setTimeout(function () {
                self.setData({ isLoadingMoreList: false })
              }, 1500)
            }
          }


          for (var i = 0; i < e.data.list.length; i++) {
            var obj = e.data.list[i]
            if (i%2 == 0){
              var subArr = []
              subArr.push(obj)
              self.data.playData.push(subArr)
            }else{
              var lastSubArr = self.data.playData[self.data.playData.length - 1]
              lastSubArr.push(obj)
            }
          }
          self.setData({ playData: self.data.playData})
          self.setSwiperH()
        },
        fail: function (e) {

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }

          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }


          if (isReachBottom) {
            self.setData({ isLoadingMoreList: false })
          }

          self.data.networkState[index].state = 0//将标识设置为失败

          wx.showToast({
            title: e.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })

        }
      })
    }else if(index == 1){

      if (page <= this.data.buyDataPage) {
        if (isPullDown) {
          wx.stopPullDownRefresh()
        }
        this.setSwiperH()
        return
      }

      if (isPullDown == false && isReachBottom == false) {
        wx.showLoading({
          title: '加载中...'
        })
      }

      this.data.networkState[index].state = -2//将标识设置为请求中
      var self = this
      var networkH = require("../../utils/networkHandle.js")
      networkH.getBuyAndSellList({
        page: page,
        type: "demand",
        success: function (e) {

          self.data.buyDataPage = page
          self.data.networkState[index].state = 1//将标识设置为成功

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }

          if (e.data.list.length == 0) {
            self.data.loadingOverFlags[index] = true
            if (isReachBottom) {
              self.setData({ isloadingListOver: true })
              setTimeout(function () {
                self.setData({ isLoadingMoreList: false })
              }, 1500)
            }
          } else {
            self.data.loadingOverFlags[index] = false
            if (isReachBottom) {
              self.setData({ isloadingListOver: false })
              setTimeout(function () {
                self.setData({ isLoadingMoreList: false })
              }, 1500)
            }
          }

          var util = require("../../utils/util.js")
          for (var i = 0; i < e.data.list.length; i++) {
            var obj = e.data.list[i]
            obj.createTime = util.formatTimeNumber(obj.createTime,'Y年M月D日')
            self.data.buyData.push(obj)
          }

          self.setData({ buyData: self.data.buyData })
          self.setSwiperH()
        },
        fail: function (e) {

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }

          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }


          if (isReachBottom) {
            self.setData({ isLoadingMoreList: false })
          }

          self.data.networkState[index].state = 0//将标识设置为失败

          wx.showToast({
            title: e.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })

        }
      })

    }else{

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setSwiperH()
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

    var index = this.data.segSelextedIndex

    this.data.loadingOverFlags[index] = false

    switch (index) {
      case 0: {
        this.data.playDataPage = -1
        this.data.playData = []
      }
        break;
      case 1: {
        this.data.buyDataPage = -1
        this.data.buyData = []
      }
        break;
      case 2: {
        this.data.workDataPage = -1
        this.data.workData = []
      }
        break;
    }

    this.loadListWithIndex(index, 0, true, false)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var index = this.data.segSelextedIndex

    if (this.data.loadingOverFlags[index]) {
      this.setData({ isLoadingMoreList: true, isloadingListOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreList: false })
      }, 1500)

      return
    }

    switch (index) {
      case 0: {
        this.setData({ isLoadingMoreList: true, isloadingListOver: false })
        var page = this.data.playDataPage + 1
        this.loadListWithIndex(0, page, false, true)
      }
        break;
      case 1: {
        this.setData({ isLoadingMoreList: true, isloadingListOver: false })
        var page = this.data.buyDataPage + 1
        this.loadListWithIndex(1, page, false, true)
      }
        break;
      case 2: {

      }
        break;
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  segClickedAction: function (e) {

    this.data.isClickedSeg = true

    let index = e.currentTarget.dataset.index
    this.setData({ segSelextedIndex: index})

    this.loadListWithIndex(index, 0, false, false)
  },

  sortAction: function (){

  },

  fillerAction: function () {

  },

  setSwiperH: function(){
    if (this.data.segSelextedIndex == 0){

      let h = (460 + 40) * Math.ceil(this.data.playData.length) + 40
      h = (h < 900 ? 900 : h)
      this.setData({ swiperH: h})


    } else if (this.data.segSelextedIndex == 1){
      let h = (165 + 30) * this.data.buyData.length + 30
      h = (h < 900 ? 900 : h)
      this.setData({ swiperH: h })
    }else{
      let h = (215 + 30) * this.data.workData.length + 30
      h = (h < 900 ? 900 : h)
      this.setData({ swiperH: h })
    }
  },

  listSwiperChange:function (e){

    if (this.data.isClickedSeg == true){
      this.data.isClickedSeg = false
      return
    }

    this.setData({ segSelextedIndex: e.detail.current })
    
    this.loadListWithIndex(this.data.segSelextedIndex, 0, false, false)
  },

  onPageScroll: function (ev) {

    var _this = this;

    let stopOnTop = false

    if (ev.scrollTop >= 0) {
      stopOnTop = true
    } else {
      stopOnTop = false
    }

    this.data.oldScrollTop = ev.scrollTop

    this.setData({ stopOnTop: stopOnTop })

  },

  clickedOnSupply:function(e){
    var supplyDemandId = e.currentTarget.dataset.supplyDemandId
    wx.navigateTo({
      url: 'buyAndPayDetail?supplyDemandId=' + supplyDemandId + "&isSupply=1",
    })
  },

  clickedOnBuyCell:function(e){
    var supplyDemandId = e.currentTarget.dataset.supplyDemandId
    wx.navigateTo({
      url: 'buyAndPayDetail?supplyDemandId=' + supplyDemandId + "&isSupply=0",
    })
  }


})