// addressList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    networkStatus:-2,

    addressList:
    [
      {
        status:0,

        addressCode:"",
        addressId:0,
        area:"",
        city:"",
        contactsName:"",
        contactsPhone:"",
        country:"",
        detail:"",
        province:""
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

    wx.showLoading({
      title: '获取中...',
    })
    this.data.networkStatus = -1
    var self = this
    var networkHandle = require("../../utils/networkHandle.js")
    networkHandle.getAddressList({
      success:function(e){
        self.data.networkStatus = 1
        wx.hideLoading()
        self.setData({ addressList:e.data})
      },
      fail:function(e){
        wx.hideLoading()
        self.data.networkStatus = 0
        wx.showToast({
          title: e.errorCode,
          image: '../../images/mine/fail.png',
          duration:1500
        })
      }
    })
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

  addNewAddress: function () {

    if (this.data.networkStatus == -1){
      wx.showModal({
        title: '提示',
        content: '请等待地址列表获取成功后添加新地址.',
        showCancel:false,
        success:function(res){

        }
      })
      return
    }

    if(this.data.networkStatus == 0){

      wx.showModal({
        title: '提示',
        content: '地址列表获取失败,不能添加新地址.',
        showCancel: false,
        success: function (res) {

        }
      })

      return
    }

    var status = 0
    if (this.data.addressList.length > 0){
      status = 0
    }else{
      status = 1
    }
    wx.navigateTo({
      url: "selecteAddress?addressArr=" + "[]" + "&address=" + "请选择" + "&addressCode=" + "" + "&name=" + "" + "&phoneNumber=" + "" + "&detailAddress=" + "" + "&addressId=" + "" + "&status=" + status
    })

  },

  settingDefaultAddress: function(e){
    wx.showLoading({
      title: '设置中...',
    })

    var networkH = require("../../utils/networkHandle.js")
    var addressId = e.currentTarget.dataset.addressId
    var self = this
    networkH.settingDefaultAddress({
      addressId: addressId,
      success:function(p){
        for(var i = 0; i < self.data.addressList.length; i++){
          var address = self.data.addressList[i]
          if (address.addressId == addressId){
            address.status = 1
          }else{
            address.status = 0
          }
        }
        self.setData({ addressList: self.data.addressList})
        wx.hideLoading()
        wx.showToast({
          title: p.successMsg,
          image: "../../images/mine/success.png",
          duration: 1500
        })
      },
      fail:function(p){
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image:"../../images/mine/fail.png",
          duration:1500
        })
      }
    })

  },

  editeAddress: function(e){

    var addressIndex = e.currentTarget.dataset.index

    var address = this.data.addressList[addressIndex]
    var addressArr = [address.province, address.city,address.area]
    var fullAddress = address.province + address.city + address.area
    wx.navigateTo({
      url: "selecteAddress?addressArr=" + JSON.stringify(addressArr) + "&address=" + fullAddress + "&addressCode=" + address.addressCode + "&name=" + address.contactsName + "&phoneNumber=" + address.contactsPhone + "&detailAddress=" + address.detail + "&addressId=" + address.addressId +"&status=" + address.status
    })
  },

  deleteAddress: function(e){
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定删除所选地址?',
      success(res) {
        if (res.confirm) {
          var addressIndex = e.currentTarget.dataset.index
          var address = self.data.addressList[addressIndex]
          var addressId = address.addressId
          var networkHandle = require("../../utils/networkHandle.js")
          wx.showLoading({
            title: '删除中...',
          })
          networkHandle.deleteAddressWithID({
            addressId: addressId,
            success: function (e) {
              wx.hideLoading()
              wx.showToast({
                title: e.successMsg,
                image: "../../images/mine/success.png",
                duration: 1500
              })
              self.data.addressList.splice(addressIndex, 1)

              var newAddressList = self.data.addressList

              self.setData({ addressList: newAddressList })
            },
            fail: function (e) {
              wx.hideLoading()
              wx.showToast({
                title: e.errorMsg,
                image: "../../images/mine/fail.png",
                duration: 1500
              })
            }
          })
        } else if (res.cancel){

        }
      }
    })
  }

})