
// pages/mine/mine.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alreadyUploadLocation:false,

    releaseDemandCount:0,
    releaseJobCount: 0,
    releaseSupplyCount: 0,
    releaseQuestionCount: 0,

    collectArticleCount:0,
    collectQuestionCount:0,
    collectSupplyDemandCount:0,
    collectQuestionCount:0,

    defaultAddress:"",
    phoneNumber:"",

    userID:-1,
    userName:"点击登录",//detault name
    iconPath:"../../images/mine/defaultIcon.png",//detault picture

    mines:
    [
      {
        hasNewMsg: true,
        value: "0",
        title: "我的私信"
      },
      {
        hasNewMsg: false,
        value: "0",
        title: "我的关注"
      },
      {
        hasNewMsg: false,
        value: "0",
        title: "我的发布"
      },
      {
        hasNewMsg: false,
        value: "0",
        title: "我的收藏"
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

  userInfoValue:function(){
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.personalCenterInfo({
      success:function(e){

        self.data.releaseDemandCount = e.data.publishDemandCount
        self.data.releaseJobCount = e.data.publishJobCount
        self.data.releaseSupplyCount = e.data.publishSupplyCount
        self.data.releaseQuestionCount = e.data.publishQuestionCount

        var releaseTotalCount = e.data.publishDemandCount + e.data.publishJobCount + e.data.publishSupplyCount + e.data.publishQuestionCount

        self.data.collectArticleCount = getApp().globalData.userCollectionList.length
        self.data.collectQuestionCount = e.data.collectionQuestionCount
        self.data.collectSupplyDemandCount = e.data.collectionSupplyDemandCount

        var collectTotalCount = self.data.collectArticleCount + e.data.collectionQuestionCount + e.data.collectionSupplyDemandCount

        self.data.mines[0]["value"] = e.data.letterCount
        self.data.mines[1]["value"] = e.data.focusCount
        self.data.mines[2]["value"] = releaseTotalCount
        self.data.mines[3]["value"] = collectTotalCount
        self.setData({
          mines: self.data.mines,
          phoneNumber: e.data.phoneNum | "",
          defaultAddress: e.data.deliveryAddress
        })
      },
      fail:function(){
        self.data.releaseDemandCount = 0
        self.data.releaseJobCount = 0
        self.data.releaseSupplyCount = 0
        self.data.releaseQuestionCount = 0
        self.data.collectArticleCount = 0
        self.data.collectQuestionCount = 0
        self.data.collectSupplyDemandCount = 0

        self.data.mines[0]["value"] = 0
        self.data.mines[1]["value"] = 0
        self.data.mines[2]["value"] = 0
        self.data.mines[3]["value"] = 0
        self.setData({
          mines: self.data.mines,
          phoneNumber: "",
          defaultAddress: ""
        })
      }

    })
  },


  upLoadLocation: function(){

    if(this.data.alreadyUploadLocation){
      return
    }

    var self = this
    var networkHandle = require("../../utils/networkHandle.js")

    networkHandle.accessAndAnalysisLocation({
      success:function(e){

        networkHandle.uploadLocation({
          lon:e.data.lng,
          lat:e.data.lat,
          province:e.data.province,
          city:e.data.city,
          area: e.data.district,
          success:function(p){
            
            self.data.alreadyUploadLocation = true
          },
          fail:function(p){

          }
        })
      },
      fail:function(e){

      }
    })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var netWorking = getApp().globalData.netWorking

    if(netWorking == true){
      var self = this
      getApp().userInfoReadyCallback = () => {

        var userInfo = getApp().globalData.userInfo

        if (userInfo) {

          this.upLoadLocation()

          self.setData({ userName: userInfo.nickName, iconPath: userInfo.avatarUrl })
          self.data.userID = userInfo.userID

          self.userInfoValue()

        } else {

          wx.showModal({
            title: "提示",
            content: "是否前往授权登陆?",
            success(res) {
              if (res.confirm) {
                //点击确定
                wx.navigateTo({
                  url: "login",
                })
              } else if (res.cancel) {
                //点击取消
              }
            }
          })

        }

      }
    }else{
      var userInfo = getApp().globalData.userInfo

      if (userInfo) {

        this.upLoadLocation()

        this.setData({ userName: userInfo.nickName, iconPath: userInfo.avatarUrl })
        this.data.userID = userInfo.userID
        this.userInfoValue()
      } else {
        wx.showModal({
          title: "提示",
          content: "是否前往授权登陆?",
          success(res) {
            if (res.confirm) {
              //点击确定
              wx.navigateTo({
                url: "login",
              })
            } else if (res.cancel) {
              //点击取消
            }
          }
        })
      }
    }
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
    console.log("onPullDownRefresh")
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

  clickedOnMineList: function (e){

    var index = e.currentTarget.dataset.index
    var navigateToUrl = ""
    if(index == 0){
      navigateToUrl = "myLetter"
    }else if(index == 1){
      navigateToUrl = "myMark"
    }else if(index == 2){
      navigateToUrl = "myRelease?releaseDemandCount=" + this.data.releaseDemandCount + "&releaseJobCount=" + this.data.releaseJobCount + "&releaseSupplyCount=" + this.data.releaseSupplyCount + "&releaseQuestionCount=" + this.data.releaseQuestionCount
    }else{
      navigateToUrl = "myCollect?collectArticleCount=" + this.data.collectArticleCount + "&collectQuestionCount=" + this.data.collectQuestionCount + "&collectSupplyDemandCount=" + this.data.collectSupplyDemandCount
    }
    var netWorking = getApp().globalData.netWorking
    if (netWorking == true) {
      getApp.userInfoReadyCallback = () => {
        var userInfo = getApp().globalData.userInfo
        if (userInfo) {
          wx.navigateTo({
            url: navigateToUrl,
          })
        } else {
          wx.showToast({
            title: '未登陆',
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      }
    } else {
      var userInfo = getApp().globalData.userInfo
      if (userInfo) {
        wx.navigateTo({
          url: navigateToUrl,
        })
      } else {
        wx.showToast({
          title: '未登陆',
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }
    }

  },

  gotoManageAddress : function (){

    var netWorking = getApp().globalData.netWorking
    if (netWorking == true) {
      getApp.userInfoReadyCallback = () => {
        var userInfo = getApp().globalData.userInfo
        if (userInfo) {
          wx.navigateTo({
            url: "addressList",
          })
        } else {
          wx.showToast({
            title: '未登陆',
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      }
    } else {
      var userInfo = getApp().globalData.userInfo
      if (userInfo) {
        wx.navigateTo({
          url: "addressList",
        })
      } else {
        wx.showToast({
          title: '未登陆',
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }
    }
  },

  enterMyAssets: function (){

    var netWorking = getApp().globalData.netWorking
    if (netWorking == true) {
      getApp.userInfoReadyCallback = () => {
        var userInfo = getApp().globalData.userInfo
        if (userInfo) {
          wx.navigateTo({
            url: "myAssets",
          })
        } else {
          wx.showToast({
            title: '未登陆',
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      }
    } else {
      var userInfo = getApp().globalData.userInfo
      if (userInfo) {
        wx.navigateTo({
          url: "myAssets",
        })
      } else {
        wx.showToast({
          title: '未登陆',
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }
    }

  },

  enterMyCrops: function () {

    var netWorking = getApp().globalData.netWorking
    if (netWorking == true) {
      getApp.userInfoReadyCallback = () => {
        var userInfo = getApp().globalData.userInfo
        if (userInfo) {
          wx.navigateTo({
            url: "myCrops",
          })
        }else{
          wx.showToast({
            title: '未登陆',
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      }
    }else{
      var userInfo = getApp().globalData.userInfo
      if (userInfo) {
        wx.navigateTo({
          url: "myCrops",
        })
      }else{
        wx.showToast({
          title: '未登陆',
          image:"../../images/mine/fail.png",
          duration:1500
        })
      }
    }

  },

  loginAction : function () {

    var netWorking = getApp().globalData.netWorking

    if (netWorking == true){
      getApp.userInfoReadyCallback = () => {
        var userInfo = getApp().globalData.userInfo
        if (userInfo) {
          return
        }
        wx.navigateTo({
          url: "login",
        })
      }
    }else{
      var userInfo = getApp().globalData.userInfo
      if (userInfo) {
        return
      }
      wx.navigateTo({
        url: "login",
      })
    }
  },

  gotoManagePhoneNum : function(){
    var phoneNumber = this.data.phoneNumber
    if (phoneNumber == ""){
      wx.navigateTo({
        url: 'changePhoneNumber',
      })
    }else{
      wx.navigateTo({
        url: 'phoneNumber?phoneNumber=' + phoneNumber,
      })
    }
  }

})

