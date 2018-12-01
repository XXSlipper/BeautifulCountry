// pages/release/work.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workDescription:"",

    workTimeType: { defaultIndex: 0, pickerType: 1, flag: 0, title: "工期分类", displayTriangleRight: true, value: "小时工", color: "black" },
    workTimeTypeContent: { name: ["小时工", "短期工","长期工"], code: ["00", "01","02"] },

    payMoneyType: { defaultIndex: 0, pickerType: 1, flag: 1, title: "结算方式", displayTriangleRight: true, value: "小时结算", color: "black" },
    payMoneyTypeContent: { name: ["小时结算","日结算", "月结算", "完工后结算"], code: ["00", "01", "02","03"] },

    money: { flag: 2, title: "薪资标准", placeHolder: "请输入薪资,如:xx元/天", resaveWord: "", inputValue: "", keyBoardType: "text" },

    workTime: { flag: 3, title: "工作时间", placeHolder: "请输入工作时间", resaveWord: "", inputValue: "", keyBoardType: "text" },

    attract: { flag: 4, title: "福利待遇", placeHolder: "请输入福利,如:包吃住", resaveWord: "", inputValue: "", keyBoardType: "text" },

    name: { flag: 5, title: "您的称呼", placeHolder: "请输入您的称呼", resaveWord: "", inputValue: "", keyBoardType: "text" },

    phoneNumber: { flag: 6, title: "联系电话", placeHolder: "请输入您的联系电话", resaveWord: "", inputValue: "", keyBoardType: "number" },

    location: { defaultIndex: [0, 0, 0], pickerType: 3, flag: 7, title: "区域地址", displayTriangleRight: true, value: "请选择位置所在区域", color: "#939393", locationIndex: [0, 0, 0] },
    locationContent: { name: [["text"], ["text"], ["text"]], code: [[], [], []] },
    locationTempXIndex: 0,

    detailLocation: { flag: 8, title: "详细地址", placeHolder: "请输入具体位置信息", resaveWord: "", inputValue: "", keyBoardType: "text" }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化 发布区域位置
    var provinceH = require("../../utils/provinceHandle.js")
    var locationArr = provinceH.Data
    var locationNameArr = []
    var locationCodeArr = []
    for (var i = 0; i < locationArr.length; i++) {
      var obj = locationArr[i]
      locationNameArr.push(obj.name)
      locationCodeArr.push(obj.code)
    }

    this.data.locationContent["name"][0] = locationNameArr
    this.data.locationContent["code"][0] = locationCodeArr

    var locationArrOne = provinceH.getDataArrWithX(0)

    this.data.locationContent["name"][1] = locationArrOne[0]
    this.data.locationContent["code"][1] = locationArrOne[1]

    var locationArrTwo = provinceH.getDataArrWithXY(0, 0)

    this.data.locationContent["name"][2] = locationArrTwo[0]
    this.data.locationContent["code"][2] = locationArrTwo[1]

    this.setData({ locationContent: this.data.locationContent })
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

  bindPickerChange: function (e) {//点击确认按钮触发
    var index = e.detail.value
    var flag = e.currentTarget.dataset.flag

    if (flag == 0) {
      this.data.workTimeType["value"] = this.data.workTimeTypeContent["name"][index]
      this.setData({ workTimeType: this.data.workTimeType })
    } else if(flag == 1){
      this.data.payMoneyType["value"] = this.data.payMoneyTypeContent["name"][index]
      this.setData({ payMoneyType: this.data.payMoneyType })
    }else if (flag == 3) {

      this.data.supplyUnit["value"] = this.data.unitContent["name"][index]

      this.data.supplySize["resaveWord"] = this.data.unitContent["name"][index]

      this.data.supplyPrice["resaveWord"] = "元/" + this.data.unitContent["name"][index]

      this.setData({ supplyUnit: this.data.supplyUnit, supplySize: this.data.supplySize, supplyPrice: this.data.supplyPrice })
    }
  },

  inputAction:function(e){
    var flag = e.currentTarget.dataset.flag
    if (flag == 2) {
      this.data.money["inputValue"] = e.detail.value
    }else if(flag == 3){
      this.data.workTime["inputValue"] = e.detail.value
    }else if(flag == 4){
      this.data.attract["inputValue"] = e.detail.value
    }else if(flag == 5){
      this.data.name["inputValue"] = e.detail.value
    }else if(flag == 6){
      this.data.phoneNumber["inputValue"] = e.detail.value
    }else{
      this.data.detailLocation["inputValue"] = e.detail.value
    }
  },

  bindMultiPickerChange: function (e) {

    var flag = e.currentTarget.dataset.flag
    var index = e.detail.value
    if (flag == 7) {
      this.data.locationIndex = index
      this.data.location["value"] = this.data.locationContent["name"][1][index[1]] + "|" + this.data.locationContent["name"][2][index[2]]
      this.data.location["color"] = "black"

      this.setData({ location: this.data.location })
    }
  },

  bindMultiPickerColumnChange: function (e) {

    var column = e.detail.column
    var value = e.detail.value

    var flag = e.currentTarget.dataset.flag

    if (flag == 7) {
      var provinceH = require("../../utils/provinceHandle.js")
      switch (column) {
        case 0: {

          var arrOne = provinceH.getDataArrWithX(value)

          this.data.locationContent["name"][1] = arrOne[0]
          this.data.locationContent["code"][1] = arrOne[1]

          var arrTwo = provinceH.getDataArrWithXY(value, 0)

          this.data.locationContent["name"][2] = arrTwo[0]
          this.data.locationContent["code"][2] = arrTwo[1]

          this.data.locationTempXIndex = value

          this.setData({ locationContent: this.data.locationContent })

        }
          break;
        case 1: {
          var x = this.data.locationTempXIndex
          var arrTwo = provinceH.getDataArrWithXY(x, value)

          this.data.locationContent["name"][2] = arrTwo[0]
          this.data.locationContent["code"][2] = arrTwo[1]

          this.setData({ locationContent: this.data.locationContent })
        }
          break;
        case 2: {

        }
          break;
      }
    }
  },

  detailInputAction:function(e){

    var inputValue = e.detail.value
    this.data.workDescription = inputValue

  },

  releaseWork: function (e) {
    
    var workDescription = this.data.workDescription
    if(workDescription.length == 0){
      wx.showModal({
        title: '提示',
        content: '招聘信息的内容不能未空!',
        showCancel:false
      })
    }

    var workTimeType = this.data.workTimeType.value


    var payMoneyType = this.data.payMoneyType.value


    var money = this.data.money.inputValue
    if(money.length <= 0){
      wx.showModal({
        title: '提示',
        content: '请输入薪资!',
        showCancel: false
      })
    }

    var workTime = this.data.workTime.inputValue
    if (workTime.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入工作时间!',
        showCancel: false
      })
    }

    var attract = this.data.attract.inputValue

    var name = this.data.name.inputValue
    if (name.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入您的称呼!',
        showCancel: false
      })
    }

    var phoneNumber = this.data.phoneNumber.inputValue


    if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
      wx.showModal({
        title: '提示',
        content: '联系电话输入错误!',
        showCancel: false
      })
    }

    var location = this.data.location.value
    if (location === "请选择位置所在区域"){
      wx.showModal({
        title: '提示',
        content: '请选择位置所在区域!',
        showCancel: false
      })
    }

    var detailLocation = this.data.detailLocation.inputValue
    if (detailLocation.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入详细地址!',
        showCancel: false
      })
    }

    wx.showLoading({
      title: '发布中',
    })
    var networkH = require("../../utils/networkHandle.js")
    networkH.releaseWork({
      status:1,
      workDescription: workDescription,
      workTimeType: workTimeType,
      payMoneyType: payMoneyType,
      money: money,
      workTime: workTime,
      attract: attract,
      name: name,
      phoneNumber: phoneNumber,
      location: location,
      detailLocation: detailLocation,
      success:function(p){
        wx.hideLoading()

        wx.showToast({
          title: '发布成功',
          image: '../../images/mine/success.png',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 0
          })
        }, 2000)
        
      },
      fail:function(p){
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }

    })
  }

  

})