// pages/mine/editeMyReleaseJob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobStatus:1,

    jobId:-1,

    jobData:{},

    workDescription: "",

    workTimeType: {
      defaultIndex: 0,
      pickerType: 1,
      flag: 0,
      title: "工期分类",
      displayTriangleRight: true,
      value: "小时工",
      color: "black"
    },
    workTimeTypeContent: {
      name: ["小时工", "短期工", "长期工"],
      code: ["00", "01", "02"]
    },

    payMoneyType: {
      defaultIndex: 0,
      pickerType: 1,
      flag: 1,
      title: "结算方式",
      displayTriangleRight: true,
      value: "小时结算",
      color: "black"
    },
    payMoneyTypeContent: {
      name: ["小时结算", "日结算", "月结算", "完工后结算"],
      code: ["00", "01", "02", "03"]
    },

    money: {
      flag: 2,
      title: "薪资标准",
      placeHolder: "请输入薪资,如:xx元/天",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "text"
    },

    workTime: {
      flag: 3,
      title: "工作时间",
      placeHolder: "请输入工作时间",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "text"
    },

    attract: {
      flag: 4,
      title: "福利待遇",
      placeHolder: "请输入福利,如:包吃住",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "text"
    },

    name: {
      flag: 5,
      title: "您的称呼",
      placeHolder: "请输入您的称呼",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "text"
    },

    phoneNumber: {
      flag: 6,
      title: "联系电话",
      placeHolder: "请输入您的联系电话",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "number"
    },

    location: {
      defaultIndex: [0, 0, 0],
      pickerType: 3,
      flag: 7,
      title: "区域地址",
      displayTriangleRight: true,
      value: "请选择位置所在区域",
      color: "#939393",
      locationIndex: [0, 0, 0]
    },
    locationContent: {
      name: [
        ["text"],
        ["text"],
        ["text"]
      ],
      code: [
        [],
        [],
        []
      ]
    },
    locationTempXIndex: 0,

    detailLocation: {
      flag: 8,
      title: "详细地址",
      placeHolder: "请输入具体位置信息",
      resaveWord: "",
      inputValue: "",
      keyBoardType: "text"
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var job = JSON.parse(options.jobStr)
    this.data.jobData = job
    this.data.jobId = job.jobId
    console.log(job)
    //初始化招聘主内容
    this.data.workDescription = job.jobDescription

    //初始化信息状态
    this.data.jobStatus = job.status

    //初始化工期分类
    var workTimeIndex = this.data.workTimeTypeContent["name"].indexOf(job.jobCat)
    var workTime = job.jobCat
    this.data.workTimeType["defaultIndex"] = workTimeIndex
    this.data.workTimeType["value"] = workTime

    //初始化结算方式
    var payMoneyIndex = this.data.payMoneyTypeContent["name"].indexOf(job.payType)
    var payType = job.payType
    this.data.payMoneyType["defaultIndex"] = payMoneyIndex
    this.data.payMoneyType["value"] = payType

    //初始化薪资
    this.data.money["inputValue"] = job.salary

    //初始化工作时间
    this.data.workTime["inputValue"] = job.time

    //初始化福利待遇
    this.data.attract["inputValue"] = job.welfare

    //初始化称呼
    this.data.name["inputValue"] = job.contact

    //初始化电话
    this.data.phoneNumber["inputValue"] = job.contactPhone

    //初始化区域地址
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

    var locationStr = job.location
    var locationArr = locationStr.split("|")
    if(locationArr.length >= 3){
      var provence = locationArr[0]
      var city = locationArr[1]
      var area = locationArr[2]
      var index_x = locationNameArr.indexOf(provence)
      var index_y = locationArrOne[0].indexOf(city)
      var index_z = locationArrTwo[0].indexOf(area)
      this.data.location["defaultIndex"] = [index_x,index_y,index_z]
      this.data.location["value"] = locationStr
      this.data.location["color"] = "black"
    }

    //初始化详细地址
    this.data.detailLocation["inputValue"] = job.address

    this.setData({
      workDescription: this.data.workDescription,
      jobStatus: this.data.jobStatus,
      workTimeType: this.data.workTimeType,
      payMoneyType: this.data.payMoneyType,
      money: this.data.money,
      workTime: this.data.workTime,
      attract: this.data.attract,
      name: this.data.name,
      phoneNumber: this.data.phoneNumber,
      locationContent: this.data.locationContent,
      location: this.data.location,
      detailLocation: this.data.detailLocation
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
  bindPickerChange: function (e) { //点击确认按钮触发
    var index = e.detail.value
    var flag = e.currentTarget.dataset.flag

    if (flag == 0) {
      this.data.workTimeType["value"] = this.data.workTimeTypeContent["name"][index]
      this.setData({
        workTimeType: this.data.workTimeType
      })
    } else if (flag == 1) {
      this.data.payMoneyType["value"] = this.data.payMoneyTypeContent["name"][index]
      this.setData({
        payMoneyType: this.data.payMoneyType
      })
    } else if (flag == 3) {

      this.data.supplyUnit["value"] = this.data.unitContent["name"][index]

      this.data.supplySize["resaveWord"] = this.data.unitContent["name"][index]

      this.data.supplyPrice["resaveWord"] = "元/" + this.data.unitContent["name"][index]

      this.setData({
        supplyUnit: this.data.supplyUnit,
        supplySize: this.data.supplySize,
        supplyPrice: this.data.supplyPrice
      })
    }
  },

  inputAction: function (e) {
    var flag = e.currentTarget.dataset.flag
    if (flag == 2) {
      this.data.money["inputValue"] = e.detail.value
    } else if (flag == 3) {
      this.data.workTime["inputValue"] = e.detail.value
    } else if (flag == 4) {
      this.data.attract["inputValue"] = e.detail.value
    } else if (flag == 5) {
      this.data.name["inputValue"] = e.detail.value
    } else if (flag == 6) {
      this.data.phoneNumber["inputValue"] = e.detail.value
    } else {
      this.data.detailLocation["inputValue"] = e.detail.value
    }
  },

  bindMultiPickerChange: function (e) {

    var flag = e.currentTarget.dataset.flag
    var index = e.detail.value
    if (flag == 7) {
      this.data.location["value"] = this.data.locationContent["name"][0][index[0]] + "|" + this.data.locationContent["name"][1][index[1]] + "|" + this.data.locationContent["name"][2][index[2]]
      this.data.location["color"] = "black"
      this.data.location["defaultIndex"] = index
      this.setData({
        location: this.data.location
      })
    }
  },

  bindMultiPickerColumnChange: function (e) {

    var column = e.detail.column
    var value = e.detail.value

    var flag = e.currentTarget.dataset.flag

    if (flag == 7) {
      var provinceH = require("../../utils/provinceHandle.js")
      switch (column) {
        case 0:
          {

            var arrOne = provinceH.getDataArrWithX(value)

            this.data.locationContent["name"][1] = arrOne[0]
            this.data.locationContent["code"][1] = arrOne[1]

            var arrTwo = provinceH.getDataArrWithXY(value, 0)

            this.data.locationContent["name"][2] = arrTwo[0]
            this.data.locationContent["code"][2] = arrTwo[1]

            this.data.locationTempXIndex = value

            this.setData({
              locationContent: this.data.locationContent
            })

          }
          break;
        case 1:
          {
            var x = this.data.locationTempXIndex
            var arrTwo = provinceH.getDataArrWithXY(x, value)

            this.data.locationContent["name"][2] = arrTwo[0]
            this.data.locationContent["code"][2] = arrTwo[1]

            this.setData({
              locationContent: this.data.locationContent
            })
          }
          break;
        case 2:
          {

          }
          break;
      }
    }
  },

  detailInputAction: function (e) {

    var inputValue = e.detail.value
    this.data.workDescription = inputValue

  },

  releaseJob: function (e) {

    var workDescription = this.data.workDescription
    if (workDescription.length == 0) {
      wx.showModal({
        title: '提示',
        content: '招聘信息的内容不能未空!',
        showCancel: false
      })
      return
    }

    var workTimeType = this.data.workTimeType.value


    var payMoneyType = this.data.payMoneyType.value


    var money = this.data.money.inputValue
    if (money.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入薪资!',
        showCancel: false
      })
      return
    }

    var workTime = this.data.workTime.inputValue
    if (workTime.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入工作时间!',
        showCancel: false
      })
      return
    }

    var attract = this.data.attract.inputValue

    var name = this.data.name.inputValue
    if (name.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入您的称呼!',
        showCancel: false
      })
      return
    }

    var phoneNumber = this.data.phoneNumber.inputValue


    if (!(/^1[34578]\d{9}$/.test(phoneNumber))) {
      wx.showModal({
        title: '提示',
        content: '联系电话输入错误!',
        showCancel: false
      })
      return
    }

    var location = this.data.location.value
    if (location === "请选择位置所在区域") {
      wx.showModal({
        title: '提示',
        content: '请选择位置所在区域!',
        showCancel: false
      })
      return
    }

    var detailLocation = this.data.detailLocation.inputValue
    if (detailLocation.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入详细地址!',
        showCancel: false
      })
      return
    }

    wx.showLoading({
      title: '发布中',
    })
    var jobId = this.data.jobId
    var status = this.data.jobStatus
    var networkH = require("../../utils/networkHandle.js")
    networkH.editJob({
      jobId: jobId,
      status: status,
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
      success: function (p) {
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
      fail: function (p) {
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png",
          duration: 1500
        })
      }

    })
  },

  changeJobStatus:function(e){
    var status = e.detail.value
    if(status == false){//关闭
    var self = this
    wx.showModal({
      title: '提示',
      content: '关闭后,该聘请信息将会从集市->工作列表中移除,确认关闭?',
      success:function(res){
        if(res.confirm){
          self.data.jobStatus = 0
        }else{
          self.data.jobStatus = 1
        }
        self.setData({ jobStatus:self.data.jobStatus})
      }
    })
    
    }else{
      this.data.jobStatus = 1
    }
  },

  deleteJob:function(e){
    if (this.data.jobId == -1) {
      return
    }
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          var networkH = require("../../utils/networkHandle.js")
          networkH.deleteMyReleaseJob({
            jobId: self.data.jobId,
            success: function (e) {
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
            fail: function (e) {
              wx.hideLoading()
              wx.showToast({
                title: e.errorMsg,
                image: '../../images/mine/fail.png',
                duration: 1500
              })
            }
          })
        } else {

        }
      }
    })
  }


})