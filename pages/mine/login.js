// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  bindGetUserInfo : function (e){

    if(e.detail.userInfo){
      //点击了允许按钮
      wx.showLoading({
        title: "登陆中...",
      })

      var networkHandle = require("../../utils/networkHandle.js")

      networkHandle.myLogin({
        userInfo: e.detail.userInfo,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        success:function(e){

          networkHandle.getFocusList({
            userId: getApp().globalData.userInfo.userID,
            success: function (p) {
              getApp().globalData.userFocusList = p.data || []
            },
            fail: function () {

            }
          })

          networkHandle.getCollectArticleList({
            success: function (p) {
              getApp().globalData.userCollectionList = p.data || []
            },
            fail: function (p) {

            }
          })

          wx.hideLoading()

          wx.showToast({
            title: e.successMsg,
            image: '../../images/mine/success.png',
            duration: 1500
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 0
            })
          }, 2000)

        },
        fail:function(e){

          wx.hideLoading()

          wx.showModal({
            title: "提示",
            content: e.errorCode + e.errorMsg,
            showCancel: false
          })
        }
      })

    }else{
      //拒绝
      wx.showModal({
        title: "警告",
        content: "您点击了拒绝授权，小程序部分功能将无法使用!!!",
        showCancel: false,
        confirmText: "重新授权",
        success: function (res) {
          if (res.confirm) {
            //点击确定
          }
        }
      })
    }
  }
})