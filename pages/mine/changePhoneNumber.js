// pages/mine/changePhoneNumber.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyInput:"",
    inputPhoneNum:"",
    inputVerifyNumber:"",
    verifyBtnTitle:"点击获取验证码",
    flag:0,//防止重复获取倒计时标记
    timer:""

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

    clearInterval(this.data.timer)

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

  verifyInput: function (e){
    var value = e.detail.value
    this.setData({ inputVerifyNumber:value})
  },

  numberInput: function (e){

    var value = e.detail.value

    this.setData({ inputPhoneNum: value })
  },

  bindPhoneNumber:function () {

    var[phoneNumber,verifyNumber] = [this.data.inputPhoneNum,this.data.inputVerifyNumber]

    if (phoneNumber == "") {
      wx.showToast({
        title: '请输入手机号',
        duration: 2000,
        icon:"none"
      })
      return
    }
    if (verifyNumber == "") {
      wx.showToast({
        title: '请输入验证码',
        duration: 2000,
        icon: "none"
      })
    }
    //send to server

    var networkHandle = require("../../utils/networkHandle.js")
    wx.showLoading({
      title: '绑定中..',
    })

    networkHandle.bindPhoneNumber({
      phoneNumber: phoneNumber,
      captchaCode: verifyNumber,
      success:function(e){
        wx.hideLoading()
        wx.showToast({
          title: e.successMsg,
          image: "../../images/mine/success.png",
          duration: 2500
        })
      },
      fail:function(e){
        wx.hideLoading()
        wx.showToast({
          title: e.errorCode,
          image:"../../images/mine/fail.png",
          duration:1500
        })
      }
    })
  },

  getVerifyNumber: function () {

    var phoneNumber = this.data.inputPhoneNum

    if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
      wx.showToast({
        title: '错误的手机号',
        duration: 2000,
        image: '../../images/mine/fail.png'
      })
      this.setData({ emptyInput: "", inputPhoneNum: "" })
      return
    }

    if(this.data.flag > 0){
      return
    }

    var self = this
    self.data.flag = 60
    self.data.timer = setInterval(
      function(){
        self.data.flag -= 1
        if(self.data.flag == 0){
          clearInterval(self.data.timer)
          self.setData({ verifyBtnTitle: "点击获取验证码"})
        }else{
          self.setData({ verifyBtnTitle: self.data.flag +"后再次获取"})
        }
      }, 1000)

    var networkHandle = require("../../utils/networkHandle.js")
    wx.showLoading({
      title: '验证码获取中...',
    })
    networkHandle.getPhoneVerifyNumber({
      phoneNumber:phoneNumber,
      success:function(e){
        wx.hideLoading()
        wx.showToast({
          title: e.successMsg,
          image: "../../images/mine/success.png",
          duration: 2500
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