
// pages/mine/mine.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"点击登录",//detault name
    iconPath:"../../images/mine/defaultIcon.png",//detault picture
    phoneNumber:"绑定手机号码",
    address:[],
    mines:
    [
      {
        hasNewMsg:false,
        value:"0",
        title:"我的发布"
      },
      {
        hasNewMsg: true,
        value: "12",
        title: "我的私信"
      },
      {
        hasNewMsg: false,
        value: "120",
        title: "我的关注"
      },
      {
        hasNewMsg: false,
        value: "121",
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var netWorking = getApp().globalData.netWorking

    if(netWorking == true){

      getApp.userInfoReadyCallback = () => {

        var userInfo = getApp().globalData.userInfo

        if (userInfo) {
          this.setData({ userName: userInfo.nickName, iconPath: userInfo.avatarUrl, userID: userInfo.userID })
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

        this.setData({ userName: userInfo.nickName, iconPath: userInfo.avatarUrl, userID: userInfo.userID })

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
      navigateToUrl = "myRelease"
    }else if(index == 1){
      navigateToUrl = "myLetter"
    }else if(index == 2){
      navigateToUrl = "myMark"
    }else{
      navigateToUrl = "myCollect"
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
    if (phoneNumber == "绑定手机号码"){
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

