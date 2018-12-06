// myCrops.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:"",
    alertTitle:"",
    selecteIndex: 0,
    hiddenmodalput: true,
    inputValue: "",
    value:"",
    crops: null//{cropsId: 2, userId: 1, cropsCode: "010101", cropsName: "核桃", cropsSize: "2",updateTime:1541853262000,createTime:1541860296000}

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

    var self = this

    wx.showLoading({
      title: '加载中...',
    })

    var networkHandle = require("../../utils/networkHandle.js")

    networkHandle.getCropList({
      userId: getApp().globalData.userInfo.userID,
      success:function(e){

        wx.hideLoading()

        self.setData({ crops: e.data })

      },
      fail:function(e){

        wx.hideLoading()

        wx.showToast({
          title: e.errorMsg,
          image: '../../images/mine/fail.png',
          duration: 1500
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

  addNewCrop: function (){

    wx.navigateTo({
      url: "selecteCrop",
    })
  },

  deleteCropAction : function (e){

    var self = this

    wx.showModal({
      title: '提示',
      content: '确定删除该作物?',
      success(res) {
        if (res.confirm) {
          //点击确定
          var cropIndex = e.currentTarget.dataset.index
          var crop = self.data.crops[cropIndex]
          var cropsId = crop.cropsId
          wx.showLoading({
            title: '删除中...'
          })

          var networkHandle = require("../../utils/networkHandle.js")

          networkHandle.deleteCropWithId({
            cropsId: cropsId,
            success:function(){

              wx.hideLoading()

              wx.showToast({
                title: '删除成功',
                image: "../../images/mine/success.png",
                duration: 1500
              })

              self.data.crops.splice(cropIndex, 1)

              var newCrops = self.data.crops

              self.setData({ crops: newCrops })

            },
            fail:function (e){
              
              wx.hideLoading()

              wx.showToast({
                title: e.errorMsg,
                image: "../../images/mine/fail.png",
                duration: 1500
              })
            }
          })
         
        } else if (res.cancel) {
          //点击取消
        }
      }
    })
  },

  modifySize: function (e) {

    var cropIndex = e.currentTarget.dataset.index
    var crop = this.data.crops[cropIndex]
    var cropName = crop.cropsName
    this.setData({ hiddenmodalput: false, selecteIndex: cropIndex, alertTitle: cropName, placeholder:"请输入种植面积(单位:亩)",value:""})

  },

  cancel: function () {
    this.setData({ hiddenmodalput: true})
  },

  confirm: function () {

    this.setData({ hiddenmodalput: true })

    var newSize = this.data.inputValue

    if (newSize == "") {
      return
    }

    if (!(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(newSize))) {

      wx.showToast({
        title: '面积输入错误',
        image: "../../images/mine/fail.png",
        duration: 1500
      })

    } else {

      wx.showLoading({
        title: '更新中...',
      })

      var cropIndex = this.data.selecteIndex
      var crop = this.data.crops[cropIndex]
      var cropsId = crop.cropsId

      var self = this

      var networkHandle = require("../../utils/networkHandle.js")

      networkHandle.updateCropSize({
        cropsId: cropsId,
        newSize: newSize,
        success: function (e) {

          wx.hideLoading()

          var crop = self.data.crops[self.data.selecteIndex]

          crop.cropsSize = newSize

          self.setData({ crops:self.data.crops})

          wx.showToast({
            title: e.successMsg,
            image: "../../images/mine/success.png",
            duration: 1500
          })

        },
        fail: function (e) {

          wx.hideLoading()

          wx.showToast({
            title: '种植面积更新失败',
            icon: "../../images/mine/fail.png",
            duration: 1500
          })
          var list = self.data.crops

          self.setData({ crops: list })
        }
      })

    }

  },

  input: function (e) {

    var value = e.detail.value

    this.setData({ inputValue: value })

  }



})