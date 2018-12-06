// pages/mine/myAssets.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    networkState:-1,
    segSelextedIndex:0,
    segTitles: [
      { title: "种子", width: 40, moveViewX:10}, 
      { title: "农药", width: 40, moveViewX: 60}, 
      { title: "肥料", width: 40, moveViewX: 110 }, 
      { title: "农器具", width: 60, moveViewX: 160}],
    swiperH: 603,
    seeds: [],//[{ capitalsCode: "", capitalsId: "", capitalsName: "", createTime: "", updateTime:""}]
    medicine: [],
    fertilizer: [],
    utensils:[]
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
      title: '农资获取中...',
    })
    this.setData({ networkState:-1})
    var self = this
    var networkHandle = require("../../utils/networkHandle.js")
    networkHandle.getAssetList({
      userId: getApp().globalData.userInfo.userID,
      success:function(e){
        var seeds = []
        var medicine = []
        var fertilizer = []
        var utensils = []
        var assets = e.data
        for (var i = 0; i < assets.length; i++){
          var asset = assets[i]
          var [a, b, c, d, e, f] = asset.capitalsCode
          var kind = a + b
          if(kind == "51"){
            seeds.push(asset)
          }else if(kind == "52"){
            medicine.push(asset)
          } else if (kind == "53") {
            fertilizer.push(asset)
          } else if (kind == "54"){
            utensils.push(asset)
          }
        }

        wx.hideLoading()

        self.setData({ networkState: 1, seeds: seeds, medicine: medicine, fertilizer: fertilizer, utensils: utensils})

      },
      fail:function(e){
        wx.hideLoading()
        self.setData({ networkState: 0 })
        wx.showToast({
          title: e.errorCode,
          image:"../../images/mine/fail.png",
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

  segClickedAction: function (e){
    let index = e.currentTarget.dataset.index
    this.setData({ segSelextedIndex: index, })
    this.swiperHwithIndex(index)
  },

  listSwiperChange:function (e){
    this.setData({ segSelextedIndex: e.detail.current })
    this.swiperHwithIndex(e.detail.current)
  },

  swiperHwithIndex:function (index){
    var utils = require("../../utils/util.js")
    var screenH = utils.screenSize().height
    var miniH = screenH - 45

    var cellNum = 0
    if(index == 0){
      cellNum = this.data.seeds.length
    }else if (index == 1){
      cellNum = this.data.medicine.length
    }else if (index == 2){
      cellNum = this.data.fertilizer.length
    }else{
      cellNum = this.data.utensils.length
    }

    var swiperH = cellNum * 70 + 100 > miniH ? cellNum * 70 + 100 : miniH

    this.setData({ swiperH: swiperH})

  },

  addNewAsset: function (){
    wx.navigateTo({
      url: 'addNewAsset',
    })
  },

  deleteAssetAction:function(e){

    var self = this
    var assetId = e.currentTarget.dataset.assetId
    var assetCode = e.currentTarget.dataset.assetCode
    wx.showModal({
      title: '提示',
      content: '确认删除所选农资?',
      success:function(res){
        if (res.confirm) {

          var networkHandle = require("../../utils/networkHandle.js")
          wx.showLoading({
            title: '删除中...',
          })
          networkHandle.deleteAssetWithId({
            assetId: assetId,
            success: function (e) {
              var [a, b, c, d, e, f] = assetCode
              var kind = a + b
              if (kind == "51") {
                var assets = self.data.seeds
                for (var i = 0; i < assets.length; i++) {
                  if (assets[i].capitalsCode == assetCode) {
                    assets.splice(i, 1)
                    break
                  }
                }
                wx.hideLoading()
                self.setData({ seeds: assets })

              } else if (kind == "52") {
                var assets = self.data.medicine
                for (var i = 0; i < assets.length; i++) {
                  if (assets[i].capitalsCode == assetCode) {
                    assets.splice(i, 1)
                    break
                  }
                }
                wx.hideLoading()
                self.setData({ medicine: assets })
              } else if (kind == "53") {
                var assets = self.data.fertilizer
                for (var i = 0; i < assets.length; i++) {
                  if (assets[i].capitalsCode == assetCode) {
                    assets.splice(i, 1)
                    break
                  }
                }
                wx.hideLoading()
                self.setData({ fertilizer: assets })
              } else if (kind == "54"){
                var assets = self.data.utensils
                for (var i = 0; i < assets.length; i++) {
                  if (assets[i].capitalsCode == assetCode) {
                    assets.splice(i, 1)
                    break
                  }
                }
                wx.hideLoading()
                self.setData({ utensils: assets })
              }

            },
            fail: function (e) {
              wx.showToast({
                title: '删除失败!',
                image: "../../images/mine/fail.png",
                duration: 1500
              })
            }
          })
        }
      }
    })
  }

})