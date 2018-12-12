// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey:"",
    inputValue: "",

    networkStatus:-2,

    currentLocation:"定位中",
    defaultLocationIndex:[0,0,0],
    locationContent: { name: [["text"], ["text"], ["text"]], code: [[], [], []] },
    locationTempXIndex:0,

    searchImgAnimData: {},
    searchImgLeft: "0px",
    searchImgCurrentLeft:0,
    searchImgNextLeft:0,
    searchBarContainerW:0,

    allUser: [],

    isloadingListOver: false,

    isLoadingMoreList: false,

    currentPage: -1

    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var searchImgAnim = wx.createAnimation({
      duration: 200,
      delay: 0
    })
    this.animation = searchImgAnim
    var self = this
    var query = wx.createSelectorQuery()
    query.select('.searchLabelContainer').boundingClientRect(function(rect) {
      var searchImgLeft = (rect.width - 32) / 2. + "px"
      self.data.searchImgCurrentLeft = (rect.width - 32) / 2.
      self.data.searchImgNextLeft = 0
      self.setData({
        searchBarContainerW: rect.width,
        searchImgLeft: searchImgLeft
      })
    }).exec()


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

    locationNameArr.unshift("全部")
    locationCodeArr.unshift("990000")
    this.data.locationContent["name"][0] = locationNameArr
    this.data.locationContent["code"][0] = locationCodeArr

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.accessAndAnalysisLocation({
      success:function(e){
        
        var x = self.data.locationContent["name"][0].indexOf(e.data.province)
        if (x < 0){
          self.data.locationContent["name"][1] = ["全部"]
          self.data.locationContent["code"][1] = ["999900"]

          self.data.locationContent["name"][2] = ["全部"]
          self.data.locationContent["code"][2] = ["999999"]

          self.setData({
            defaultLocationIndex: [0, 0, 0],
            locationContent: self.data.locationContent,
            currentLocation: "全部"
          })

          self.getUsersWithLocation("全部", "全部", "全部", 0,false)
          return
        }

        var arrOne = provinceH.getDataArrWithX((x - 1))
        self.data.locationContent["name"][1] = arrOne[0]
        self.data.locationContent["code"][1] = arrOne[1]

        var y = self.data.locationContent["name"][1].indexOf(e.data.city)
        if (y < 0) {
          self.data.locationContent["name"][1] = ["全部"]
          self.data.locationContent["code"][1] = ["999900"]

          self.data.locationContent["name"][2] = ["全部"]
          self.data.locationContent["code"][2] = ["999999"]

          self.setData({
            defaultLocationIndex: [0, 0, 0],
            locationContent: self.data.locationContent,
            currentLocation: "全部"
          })

          self.getUsersWithLocation("全部", "全部", "全部", 0,false)

          return
        }


        
        var arrTwo = provinceH.getDataArrWithXY((x - 1), y)

        self.data.locationContent["name"][2] = arrTwo[0]
        self.data.locationContent["code"][2] = arrTwo[1]

        var z = self.data.locationContent["name"][2].indexOf(e.data.district)

        if(z < 0){

          self.data.locationContent["name"][1] = ["全部"]
          self.data.locationContent["code"][1] = ["999900"]

          self.data.locationContent["name"][2] = ["全部"]
          self.data.locationContent["code"][2] = ["999999"]

          self.setData({
            defaultLocationIndex: [0, 0, 0],
            locationContent: self.data.locationContent,
            currentLocation: "全部"
          })

          self.getUsersWithLocation("全部", "全部", "全部", 0,false)

        }else{

          self.setData({
            defaultLocationIndex: [x, y, z],
            locationContent: self.data.locationContent,
            currentLocation: e.data.district
          })

          self.getUsersWithLocation(
            self.data.locationContent["name"][0][x], self.data.locationContent["name"][1][y], 
            self.data.locationContent["name"][2][z], 
            0,false)

        }

      },
      fail:function(e){

        self.data.locationContent["name"][1] = ["全部"]
        self.data.locationContent["code"][1] = ["999900"]

        self.data.locationContent["name"][2] = ["全部"]
        self.data.locationContent["code"][2] = ["999999"]

        self.setData({
          defaultLocationIndex:[0,0,0],
          locationContent: self.data.locationContent,
          currentLocation: "全部"
        })

        self.getUsersWithLocation("全部", "全部", "全部", 0,false)
      }
    })
  },

  getUsersWithLocation: function (provence, city, area, page, isReachBottom){

    if (this.data.networkStatus == -1){
      return;
    }

    if (isReachBottom == false){
      wx.showLoading({
        title: '加载中...',
      })
    }
    

    var self = this
    var data = {
      page:page,
      success: function(e){

        if(isReachBottom == false){
          wx.hideLoading()
        }
        
        self.data.networkStatus = 1

        self.data.currentPage = page

        var users = e.data.list

        if (e.data.list.length == 0) {
          self.data.isloadingListOver = true
          if (isReachBottom) {
            self.setData({ isloadingListOver: true })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        } else {
          self.data.isloadingListOver = false
          if (isReachBottom) {
            self.setData({ isloadingListOver: false })
            setTimeout(function () {
              self.setData({ isLoadingMoreList: false })
            }, 1500)
          }
        }
        var newAllUser = self.data.allUser.concat(e.data.list)

        self.setData({
          allUser: newAllUser
        })
      },
      fail:function(e){

        if (isReachBottom == false) {
          wx.hideLoading()
        }
        self.data.networkStatus = 0
        wx.showToast({
          title: e.errorMsg,
          image:"../../images/mine/fail.png",
          duration:1500
        })
      }
    }

    if(provence != "全部"){
      data["provence"] = provence
      data["city"] = city
      data["area"] = area
    }

    var searchKey = this.data.searchKey

    if(searchKey != ""){
      data["searchKey"] = searchKey
    }

    this.data.networkStatus = -1
    var networkH = require("../../utils/networkHandle.js")
    networkH.getUserListWithLocation(data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if (this.data.isloadingListOver) {
      this.setData({ isLoadingMoreList: true, isloadingListOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreList: false })
      }, 1500)

      return
    }

    this.setData({ isLoadingMoreList: true, isloadingListOver: false })

    var page = this.data.currentPage + 1

    var index = this.data.defaultLocationIndex
    this.getUsersWithLocation(
      this.data.locationContent["name"][0][index[0]], this.data.locationContent["name"][1][index[1]],
      this.data.locationContent["name"][2][index[2]],
      page, true)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  blurAction: function() {

    this.setData({
      inputValue:this.data.searchKey
    }) 
    if (this.data.inputValue == ""){
      this.blurAnimation()
    }
  },

  focusAction: function() {

    if (this.data.inputValue == "") {
      this.focusAnimation()
    }

  },

  focusAnimation: function() {

    var left = this.data.searchImgNextLeft
    this.animation.scale(0.8, 0.8).left(left).step()
    this.setData({
      searchImgAnimData: this.animation.export()
    })

    this.data.searchImgNextLeft = this.data.searchImgCurrentLeft
    this.data.searchImgCurrentLeft = left

  },

  blurAnimation: function() {

    var left = this.data.searchImgNextLeft

    this.animation.scale(1, 1).left(left).step()
    this.setData({
      searchImgAnimData: this.animation.export()
    })

    this.data.searchImgNextLeft = this.data.searchImgCurrentLeft
    this.data.searchImgCurrentLeft = left
  },


  confirmAction: function() {

    this.data.searchKey = this.data.inputValue
    this.data.allUser = []
    this.data.isloadingListOver = false
    this.data.isLoadingMoreList = false

    var index = this.data.defaultLocationIndex

    this.getUsersWithLocation(
      this.data.locationContent["name"][0][index[0]], this.data.locationContent["name"][1][index[1]],
      this.data.locationContent["name"][2][index[2]],
      0, false)

  },

  inputAction: function(e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindMultiPickerChange: function (e) {
    var index = e.detail.value
    this.data.defaultLocationIndex = index
    var currentLocation  = this.data.locationContent["name"][2][index[2]]
    this.setData({ 
      defaultLocationIndex: index,
      currentLocation: currentLocation
    })

    this.data.allUser = []
    this.data.isloadingListOver = false
    this.data.isLoadingMoreList = false

    this.getUsersWithLocation(
      this.data.locationContent["name"][0][index[0]], this.data.locationContent["name"][1][index[1]],
      this.data.locationContent["name"][2][index[2]],
      0, false)

  },

  bindMultiPickerColumnChange: function (e) {

    var column = e.detail.column
    var value = e.detail.value

    var provinceH = require("../../utils/provinceHandle.js")
    switch (column) {
      case 0: {
        if(value == 0){
          this.data.locationContent["name"][1] = ["全部"]
          this.data.locationContent["code"][1] = ["999900"]

          this.data.locationContent["name"][2] = ["全部"]
          this.data.locationContent["code"][2] = ["999999"]
          this.setData({ locationContent: this.data.locationContent })
          return
        }else{
          value -= 1
        }
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
        if (value == 0) {
          this.data.locationContent["name"][1] = ["全部"]
          this.data.locationContent["code"][1] = ["999900"]

          this.data.locationContent["name"][2] = ["全部"]
          this.data.locationContent["code"][2] = ["999999"]

          this.setData({ locationContent: this.data.locationContent })
          return
        } else {

        }
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
  },

  clickedCell:function(e){
    var userId = e.currentTarget.dataset.userId

    wx.navigateTo({
      url: '../mine/userDetailInfo?userId=' + userId,
    })

  }

})