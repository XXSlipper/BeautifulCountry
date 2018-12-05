// pages/release/supply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplyType: { defaultIndex: 0, pickerType: 1, flag: 0, title: "供求类型", displayTriangleRight: true, value: "发布供应", color:"black"},
    supplyTypeContent: { name: ["发布供应", "发布求购"], code: ["00", "01"]},

    goodsTempXIndex:0,
    goodsType: { defaultIndex: [0, 0, 0], pickerType: 3, flag: 1, title: "商品类型", displayTriangleRight: true, value: "请选择商品类型", color: "#939393",goodsIndex:[0,0,0]},
    goodsContent: { name: [["text"], ["text"], ["text"]], code: [[], [], []]},

    title: { flag: 2, title: "标题", placeHolder: "请输入发布的标题", resaveWord:"",inputValue:"",keyBoardType:"text"},

    pictures: [{ hidden: true, url: "" }, { hidden: true, url: "" }, { hidden: true, url: "" }],
    addPicCount: 0,

    supplyUnit: { defaultIndex: 0, pickerType: 1, flag: 3, title: "单位", displayTriangleRight: true, value: "斤", color: "black" },
    unitContent: { name: ["斤", "公斤", "吨", "件", "枚", "盒", "架", "台", "副", "箱", "桶", "克", "千克", "框", "套", "包", "只", "头", "棵", "袋", "瓶", "升", "毫升", "亩", "次", "平米", "车"], code: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27"]},

    supplySize: { flag: 4, title: "商品数量", placeHolder: "请输入商品数量", resaveWord: "斤", inputValue: "", keyBoardType: "digit"},

    supplyPrice: { flag: 5, title: "商品价格", placeHolder: "不填写默认面议", resaveWord: "元/斤", inputValue: "", keyBoardType: "digit"},

    pnoneNumber: { flag: 6, title: "联系电话", placeHolder: "请输入您的联系电话", resaveWord: "", inputValue: "", keyBoardType: "number"},

    location: { defaultIndex: [0, 0, 0], pickerType: 3, flag: 7, title: "供应位置", displayTriangleRight: true, value: "请选择供应位置", color: "#939393",locationIndex:[0,0,0]},
    locationContent: { name: [["text"], ["text"], ["text"]], code: [[], [], []] },
    locationTempXIndex:0,

    detailLocation: { flag: 8, title: "位置详细信息", typeCode: "", typeName: "", placeHolder: "请输入具体位置信息", displayTriangleRight: false },
    

    detailDescription:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //初始化 发布商品类型
    var releaseH = require("../../utils/releaseHandle.js")
    var bigArr = releaseH.Data
    var nameArr = []
    var codeArr = []
    for(var i = 0;i < bigArr.length;i++){
      var obj = bigArr[i]
      nameArr.push(obj.name)
      codeArr.push(obj.code)
    }
    this.data.goodsContent["name"][0] = nameArr
    this.data.goodsContent["code"][0] = codeArr
    
    var arrOne = releaseH.getDataArrWithX(0)

    this.data.goodsContent["name"][1] = arrOne[0]
    this.data.goodsContent["code"][1] = arrOne[1]
   
    var arrTwo = releaseH.getDataArrWithXY(0,0)

    this.data.goodsContent["name"][2] = arrTwo[0]
    this.data.goodsContent["code"][2] = arrTwo[1]

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

    this.setData({ goodsContent: this.data.goodsContent, locationContent: this.data.locationContent})
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

  addMorePic: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var image = res.tempFiles[0]
        if (image.size > 4 * 1024 * 1024) {
          wx.showModal({
            title: '提示',
            content: '图片大小超过规定范围,请重新选择!',
            showCancel: false
          })
          return
        }

        var picture = self.data.pictures[self.data.addPicCount]
        picture.hidden = false
        picture.url = image.path
        self.data.addPicCount += 1
        self.setData({ pictures: self.data.pictures, addPicCount: self.data.addPicCount })
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: e.errMsg,
          showCancel: false
        })
      }
    })
  },
  deletePic: function (e) {
    var index = e.currentTarget.dataset.index
    this.data.pictures.splice(index, 1)
    this.data.pictures.push({
      hidden: true,
      url: ""
    })
    this.data.addPicCount -= 1
    this.setData({ pictures: this.data.pictures, addPicCount: this.data.addPicCount })
  },

  bindPickerChange:function(e){//点击确认按钮触发
    var index = e.detail.value
    var flag = e.currentTarget.dataset.flag

    if(flag == 0){
      this.data.supplyType["value"] = this.data.supplyTypeContent["name"][index]
      this.setData({ supplyType: this.data.supplyType})
    }else if(flag == 3){

      this.data.supplyUnit["value"] = this.data.unitContent["name"][index]
      
      this.data.supplySize["resaveWord"] = this.data.unitContent["name"][index]

      this.data.supplyPrice["resaveWord"] = "元/" + this.data.unitContent["name"][index]

      this.setData({ supplyUnit: this.data.supplyUnit, supplySize: this.data.supplySize, supplyPrice: this.data.supplyPrice})
    }
  },

  bindMultiPickerChange:function(e){

    var flag = e.currentTarget.dataset.flag
    var index = e.detail.value
    if(flag == 1){
      this.data.goodsType["goodsIndex"] = index
      this.data.goodsType["value"] = this.data.goodsContent["name"][2][index[2]]
      this.data.goodsType["color"] = "black"
      this.setData({ goodsType:this.data.goodsType})

    }else if (flag == 7){
      this.data.locationIndex = index
      this.data.location["value"] = this.data.locationContent["name"][0][index[0]] + "|" + this.data.locationContent["name"][1][index[1]] + "|" + this.data.locationContent["name"][2][index[2]]
      this.data.location["color"] = "black"

      this.setData({ location: this.data.location })
    }
  },

  bindMultiPickerColumnChange:function(e){

    var column = e.detail.column
    var value = e.detail.value

    var flag = e.currentTarget.dataset.flag

    if(flag == 1){
      var releaseH = require("../../utils/releaseHandle.js")
      switch (column) {
        case 0: {
          var arrOne = releaseH.getDataArrWithX(value)

          this.data.goodsContent["name"][1] = arrOne[0]
          this.data.goodsContent["code"][1] = arrOne[1]

          var arrTwo = releaseH.getDataArrWithXY(value, 0)

          this.data.goodsContent["name"][2] = arrTwo[0]
          this.data.goodsContent["code"][2] = arrTwo[1]

          this.data.goodsTempXIndex = value

          this.setData({ goodsContent: this.data.goodsContent })

        }
          break;
        case 1: {
          var x = this.data.goodsTempXIndex
          var arrTwo = releaseH.getDataArrWithXY(x, value)

          this.data.goodsContent["name"][2] = arrTwo[0]
          this.data.goodsContent["code"][2] = arrTwo[1]

          this.setData({ goodsContent: this.data.goodsContent })
        }
          break;
        case 2: {

        }
          break;
      }
    }else if(flag == 7){
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

  inputAction:function (e){
    var flag = e.currentTarget.dataset.flag
    if(flag == 2){
      this.data.title["inputValue"] = e.detail.value
    }else if(flag == 4){
      this.data.supplySize["inputValue"] = e.detail.value
    }else if(flag == 5){
      this.data.supplyPrice["inputValue"] = e.detail.value
    }else if (flag == 6){
      this.data.pnoneNumber["inputValue"] = e.detail.value
    }
  },

  detailInputAction:function (e){
    var value = e.detail.value
    this.data.detailDescription = value
  },

  releaseSupply: function(e){
    var supplyType = ""
    if (this.data.supplyType["value"] == "发布供应") {
      supplyType = "supply"
    } else {
      supplyType = "demand"
    }

    var goodsType = this.data.goodsType["value"]
    if (goodsType === "请选择商品类型") {
      wx.showModal({
        title: '提示',
        content: '请选择商品类型',
        showCancel: false
      })
      return
    }

    var goodsTypeCode = this.data.goodsContent["code"][2][this.data.goodsType["goodsIndex"][2]]

    var title = this.data.title["inputValue"]
    if (title.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入发布的标题',
        showCancel: false
      })
      return
    }

    var unit = this.data.supplyUnit["value"]

    var goodsNum = this.data.supplySize["inputValue"]

    var goodsPrice = this.data.supplyPrice["inputValue"]

    var phoneNumber = this.data.pnoneNumber["inputValue"]

    if (goodsNum.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请输入商品数量',
        showCancel: false
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
      wx.showModal({
        title: '提示',
        content: '手机号码输入有误',
        showCancel: false
      })
      return
    }

    if (this.data.location["value"] === "请选择供应位置") {
      wx.showModal({
        title: '提示',
        content: '请选择供应位置',
        showCancel: false
      })
      return
    }
    var locationIndex = this.data.location["locationIndex"]

    var locationName = this.data.locationContent["name"][0][locationIndex[0]] + this.data.locationContent["name"][1][locationIndex[1]] + this.data.locationContent["name"][2][locationIndex[2]]

    var locationCode = this.data.locationContent["code"][2][locationIndex[2]]

    var description = this.data.detailDescription

    var networkH = require("../../utils/networkHandle.js")

    wx.showLoading({
      title: '发布中...',
    })
    var self = this
    networkH.releaseBuyAndSell({
      type: supplyType,
      goodsType: goodsType,
      goodsTypeCode: goodsTypeCode,
      title: title,
      unit: unit,
      goodsNum: goodsNum,
      goodsPrice: goodsPrice,
      phoneNumber: phoneNumber,
      location: locationName,
      locationCode: locationCode,
      description: description,
      success: function (p) {
        if (self.data.addPicCount == 0) {

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

        } else {

          var supplyDemandId = p.data.supplyDemandId

          var uploadCount = 0
          var myNetworkH = require("../../utils/networkHandle.js")
          for (var i = 0; i < self.data.pictures.length; i++) {
            if (self.data.pictures[i].hidden == false) {

              var imgPath = self.data.pictures[i].url

              console.log(imgPath)

              myNetworkH.uploadImgForBuyAndSell({
                supplyDemandId: supplyDemandId,
                filePath: imgPath,
                success: function (q) {
                  uploadCount++
                  if (uploadCount == self.data.addPicCount) {
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
                  }
                },
                fail: function (q) {

                  uploadCount++
                  if (uploadCount == self.data.addPicCount) {
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
                  }
                }
              })
            }
          }

        }
      },
      fail: function (p) {
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