// selecteAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,

    isAddNewAddress:true,
    addressArr:[],
    address:"请选择",
    addressCode:"",
    name:"",
    phoneNumber:"",
    detailAddress:"",
    addressId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var addressArr = JSON.parse(options.addressArr)
    this.data.status = options.status
    if(addressArr.length > 0){
      this.data.isAddNewAddress = false
    }
    this.setData({
      addressId: options.addressId,
      addressArr: addressArr,
      address: options.address,
      addressCode: options.addressCode,
      name: options.name,
      phoneNumber: options.phoneNumber,
      detailAddress: options.detailAddress
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

  inputAction : function (e) {
    var index = e.currentTarget.dataset.cellIndex

    if(index == 0){
      this.setData({ name: e.detail.value})
    }else if(index == 1){
      this.setData({ phoneNumber: e.detail.value })
    }else if (index == 3){
      this.setData({ detailAddress: e.detail.value })
    }

  },

  selecteArea : function (){
     wx.navigateTo({
       url: "areaList?showType=" + "0",
     })
  },

  saveAction : function (){
    var name = this.data.name
    if (name == "") {
      wx.showToast({
        title: "请输入联系人",
        duration: 2000,
        icon: 'none'
      })
      return
    }


    var phoneNum = this.data.phoneNumber
    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号码有误',
        duration: 2000,
        image: '../../images/mine/fail.png'
      })
      return
    }

    var address = this.data.address
    if (address == "请选择") {
      wx.showToast({
        title: "未选择所在区域",
        duration: 2000,
        icon: 'none'
      })
      return
    }

    var detailAddress = this.data.detailAddress
    if (detailAddress == "") {
      wx.showToast({
        title: "未填写详细地址",
        duration: 2000,
        icon: 'none'
      })
      return
    }


    //send to server
    wx.showLoading({
      title: '保存中...',
    })
    var self = this

    if(self.data.isAddNewAddress){
      var networkHandle = require("../../utils/networkHandle.js")
      networkHandle.saveAddress({
        status:self.data.status,
        contactsName: name,
        contactsPhone: phoneNum,
        addressCode: self.data.addressCode,
        country: "China",
        province: self.data.addressArr[0],
        city: self.data.addressArr[1],
        area: self.data.addressArr[2],
        detail: detailAddress,
        success: function (e) {

          wx.hideLoading()

          wx.showToast({
            title: e.successMsg,
            image: "../../images/mine/success.png",
            duration: 1500
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        },
        fail: function (e) {

          wx.hideLoading()

          wx.showToast({
            title: e.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }else{
      var networkHandle = require("../../utils/networkHandle.js")
      networkHandle.updateAddress({
        status: self.data.status,
        addressId: self.data.addressId,
        contactsName: name,
        contactsPhone: phoneNum,
        addressCode: self.data.addressCode,
        country: "China",
        province: self.data.addressArr[0],
        city: self.data.addressArr[1],
        area: self.data.addressArr[2],
        detail: detailAddress,
        success: function (e) {

          wx.hideLoading()

          wx.showToast({
            title: e.successMsg,
            image: "../../images/mine/success.png",
            duration: 1500
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        },
        fail: function (e) {

          wx.hideLoading()

          wx.showToast({
            title: e.errorCode,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }
    
  }

})