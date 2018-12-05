// pages/mine/userDetailInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:"",
    iconUrl:"",
    beFocusCount:0,
    focusCount:0,
    isFocus:false,

    stopOnTop:false,
    oldScrollTop:0,

    topHeaderH:0,

    miniH:0,

    userId:0,

    networkStates:[-2,-2,-2,-2,-2,-2,-2,-2],
    loadOverFlags: [false, false],
    isloadingListOver: false,
    isLoadingMoreList: false,

    swiperH:0,
    selectedIndex:0,

    segTotalWidth: 616,
    segTitles: [{ title: "他的供应", width: 64 }, { title: "他的求购", width: 64 }, { title: "他的种植", width: 64 }, { title: "他的农资", width: 64 }, { title: "他收藏的问答", width: 90 }, { title: "他收藏的供应", width: 90 }, { title: "他收藏的求购", width: 90 }, { title: "他收藏的新闻", width: 90 }],

    supplyPage: -1,
    supplyData:[],

    remandPage: -1,
    remandData:[],

    questionPage: -1,
    questionData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userId = options.userId

    var self = this
    var query = wx.createSelectorQuery()
    query.select('.header').boundingClientRect(function (rect) {
      self.setData({ topHeaderH: rect.height})
      self.data.miniH  = wx.getSystemInfoSync().windowHeight - rect.height

    }).exec()

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getSomeBodyInfo({
      userId:self.data.userId,
      success:function(e){

        console.log(e.data)

        var focusList = getApp().globalData.userFocusList

         var isFocus = false
        for (var i = 0; i < focusList.length; i++) {
          var obj = focusList[i]
          if (obj.userId == self.data.userId) {
            isFocus = true
            break
          }
        }
        var nickName = e.data.nickName
        var iconUrl = e.data.avatarUrl
        var focusCount = e.data.focusCount
        var beFocusCount = e.data.beFocusCount

        self.setData({
          isFocus: isFocus,
          nickName: nickName,
          iconUrl: iconUrl,
          focusCount: focusCount,
          beFocusCount: beFocusCount
        })

        self.loadData(0, 0, false)
      },
      fail:function(e){

        wx.showToast({
          title: e.errorMsg,
          image:"../../images/mine/fail.png",
          duration:1500
        })

      }
    })
    
  },

  setSwiperH:function(index){

    if(index == 5 | index == 6){
      var miniH = 548
      var contentH = 0
      if(index == 5){
        contentH = (460 + 40) * Math.ceil(this.data.supplyData.length) + 40
      }else if(index == 6){
        contentH = (165 + 30) * this.data.remandData.length + 30
      }else{

      }
      this.setData({ swiperH: miniH > contentH ? miniH + "rpx" : contentH + "rpx" })
    }else{

      switch (index) {

        case 0: {

        }
          break

        case 1: {

        }
          break
        case 2: {

        }
          break
        case 3: {

        }
          break

        case 4: {
          var self = this
          var query2 = wx.createSelectorQuery()
          query2.select(".questionContainer").boundingClientRect(function (rect) {
            var miniH = self.data.miniH
            var contentH = rect.height + 12
            self.setData({ swiperH: miniH > contentH ? miniH + "px" : contentH + "px" })
          }).exec()
        }
          break

        case 7: {
          var miniH = this.data.miniH
          this.setData({ swiperH: miniH + "px" })
        }
          break

      }

    }

  },

  loadData:function(index,page,isReachBottom){

    if(index == 7){
      this.setSwiperH(index)
      return
    }
    if (this.data.networkStates[index] == -1) {

      this.setSwiperH(index)
      return
    }

    if(index == 5 | index == 6){
      
      var comparePage = (index == 5 ? this.data.supplyPage : this.data.remandPage)
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
      networkH.userMarkSupplyOrDemandList({
        page: page,
        userId: self.data.userId,
        type: (index == 5 ? "supply" : "demand"),
        success: function (e) {
          if (isReachBottom == false) {
            wx.hideLoading()
          }
          self.data.networkStates[index] = 1
          if (index == 5) {
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

          if (index == 5) {
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
            title: p.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      })

    }else if(index == 4){

      if (page <= this.data.questionPage) {
        this.setSwiperH(index)
        return
      }

      this.data.networkStates[index] = -1

      if (isReachBottom == false) {
        wx.showLoading({
          title: '加载中...',
        })
      }
      var self = this
      var networkH = require("../../utils/networkHandle.js")
      networkH.userMarkQuestionList({
        page: page,
        userId:self.data.userId,
        success: function (e) {
          if (isReachBottom == false) {
            wx.hideLoading()
          }
          self.data.networkStates[index] = 1
          self.data.questionPage = page
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
          var newQuestionList = self.data.questionData.concat(e.data.list)

          self.setData({ questionData: newQuestionList })

          self.setSwiperH(index)
        },
        fail: function (p) {
          if (isReachBottom == false) {
            wx.hideLoading()
          }

          self.data.networkStates[index] = 0

          wx.showToast({
            title: p.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      })
    }


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
    var index = this.data.selectedIndex


    if(index == 7){
      return
    }
    if (this.data.loadOverFlags[index]) {
      this.setData({ isLoadingMoreList: true, isloadingListOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreList: false })
      }, 1500)

      return
    }
    this.setData({ isLoadingMoreList: true, isloadingListOver: false })
    if(index == 0){

    }else if(index == 1){

    } else if (index == 2) {

    } else if (index == 3) {

    }else if(index == 4){
      var page = this.data.questionPage + 1
      this.loadData(index, page, true)
    }
    else if (index == 5) {

      var page = this.data.supplyPage + 1
      this.loadData(index, page, true)

    } else if(index == 6){
      var page = this.data.remandPage + 1
      this.loadData(index, page, true)
    }else{

    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  listSwiperChange:function(e){

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

  onPageScroll: function (ev) {

    var _this = this;

    let stopOnTop = false

    if (ev.scrollTop >= (this.data.topHeaderH - 120)) {
      stopOnTop = true
      var addH = ev.scrollTop - (this.data.topHeaderH - 144)
    } else {
      stopOnTop = false
      var reduceH = (this.data.topHeaderH - 144) - ev.scrollTop
    }

    this.data.oldScrollTop = ev.scrollTop

    this.setData({ stopOnTop: stopOnTop })

  },

  focusAction:function(e){
    var userId = this.data.userId
    if (userId == getApp().globalData.userInfo.userID) {
      wx.showToast({
        title: '不能关注自己',
        icon: "none",
        duration: 2000
      })
      return
    }

    var focusList = getApp().globalData.userFocusList
    var focusId = -1
    for (var i = 0; i < focusList.length; i++) {
      var obj = focusList[i]
      if (obj.userId == userId) {
        focusId = obj.focusId
        break
      }
    }

    var self = this
    if (this.data.isFocus) {
      wx.showLoading({
        title: '取消中...',
      })
      var networkH = require("../../utils/networkHandle.js")
      networkH.cancelFocus({
        focusId: focusId,
        success: function (p) {
          wx.hideLoading()
          for (var i = 0; i < focusList.length; i++) {
            var obj = focusList[i]
            if (obj.userId == userId) {
              focusList.splice(i, 1)
              break
            }
          }

          self.setData({ isFocus: false })

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
    } else {

      wx.showLoading({
        title: '关注中...',
      })

      var networkH = require("../../utils/networkHandle.js")
      networkH.focusUser({
        focusUserId: userId,
        success: function (p) {
          wx.hideLoading()
          self.setData({ isFocus: true })
          getApp().globalData.userFocusList.push(p.data)
          wx.showToast({
            title: p.successMsg,
            image: "../../images/mine/success.png",
            duration: 1500
          })
        },
        fail: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      })

    }


  }

})