// selecteCrop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    placeholder:"请输入种植面积(单位:亩)",
    inputValue:"",
    hiddenmodalput:true,
    selecteIndex:{x:0,y:0,z:0},
    alertTitle:"",
    xlist:{},
    ylist:{},
    zlist:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var e = this.data.selecteIndex
    this.loadDataWithSelecteIndex(e)
  },

  loadDataWithSelecteIndex: function(e){

    var cropsHandle = require("../../utils/cropsHandle.js")
    var xlist = cropsHandle.getListX()
    var xcode = xlist["code"][e.x]
    var ylist = cropsHandle.getListYWithXcode(xcode)
    var ycode = ylist["code"][e.y]
    var zlist = cropsHandle.getListZWithYcode(ycode)

    this.setData({ xlist: xlist, ylist: ylist, zlist: zlist, selecteIndex:e})

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

  clickOnXlistCell : function (e){
    var x = e.currentTarget.dataset.index
    var selecteIndex = {x:x,y:0,z:0}
    this.loadDataWithSelecteIndex(selecteIndex)
  },

  clickOnYlistCell : function (e){
    var x = this.data.selecteIndex.x
    var y = e.currentTarget.dataset.index
    var selecteIndex = {x:x,y:y,z:0}
    this.loadDataWithSelecteIndex(selecteIndex)
  },

  clickOnZlistCell: function (e){
    var x = this.data.selecteIndex.x
    var y = this.data.selecteIndex.y
    var z = e.currentTarget.dataset.index
    var selecteIndex = { x: x, y: y, z: z }
    this.loadDataWithSelecteIndex(selecteIndex)
  },



  sureSelecte: function (){

    var name = this.data.zlist["name"][this.data.selecteIndex.z]

    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      alertTitle:name
    })

  },

  cancel: function (){
    this.setData({ hiddenmodalput: true, value: ""})
  },

  confirm: function(){
    var inputValue = this.data.inputValue

    if (!(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(inputValue))) {
      this.setData({value:"",placeholder:"错误的种植面积,请重新输入!"})
    }else{
      this.setData({ hiddenmodalput: true, value: ""})

      var name = this.data.zlist["name"][this.data.selecteIndex.z]

      var code = this.data.zlist["code"][this.data.selecteIndex.z]

      var crop = { name: name, code: code, size: inputValue }
      //send to server 
      //......
      wx.showLoading({
        title: '添加中...',
      })

      var networkHandle = require("../../utils/networkHandle.js")

      networkHandle.addNewCrop({
        cropsCode: code,
        cropsName: name,
        cropsSize: inputValue,
        success:function (e){

          wx.hideLoading()

          wx.showToast({
            title: e.successMsg,
            image: "../../images/mine/success.png",
            duration: 1500
          })

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

    }

  },

  input: function (e){

    var value = e.detail.value

    this.setData({inputValue:value})

  }

})