// areaList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType:0,
    selecteProvince:"",
    selecteCity:"",
    provinceList: {name: ["湖南省"],code:["040000"]},
    cityList: { name: ["张家界"], code: ["041000"]},
    areaList:{name:["慈利县"],code:["041001"]}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var provinceHandle = require('../../utils/provinceHandle.js')

    if(options.showType == 0){
      var provinceList = provinceHandle.getProvinceList()

      this.setData({ provinceList: provinceList, showType: options.showType })

    }else if (options.showType == 1){
      var provinceCode = options.provinceCode
      var provinceName = options.provinceName
      var cityList = provinceHandle.getCityListWithProvinceCode(provinceCode)

      this.setData({ cityList: cityList, showType: options.showType, selecteProvince: provinceName })

    }else if(options.showType == 2){
      
      var provinceName = options.provinceName

      var cityName = options.cityName

      var cityCode = options.cityCode

      var areaList = provinceHandle.getAreaListWithCityCode(cityCode)

      this.setData({ areaList: areaList, showType: options.showType, selecteProvince: provinceName, selecteCity: cityName})
    }
    
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

  clickOnCell: function (e){
    if(this.data.showType == 0){
      
      var provinceCode = this.data.provinceList["code"][e.currentTarget.dataset.index]
      var provinceName = this.data.provinceList["name"][e.currentTarget.dataset.index]
      wx.navigateTo({
        url: "areaList?showType=" + "1" + "&provinceCode=" + provinceCode + "&provinceName=" + provinceName,
      })

    }
    else if (this.data.showType == 1){

      var provinceName = this.data.selecteProvince

      var cityCode = this.data.cityList["code"][e.currentTarget.dataset.index]

      var cityName = this.data.cityList["name"][e.currentTarget.dataset.index]

      wx.navigateTo({
        url: "areaList?showType=" + "2" + "&cityCode=" + cityCode + "&cityName=" + cityName + "&provinceName=" + provinceName,
      })

    }
    else if (this.data.showType == 2){

      var areaName = this.data.areaList["name"][e.currentTarget.dataset.index]

      var areaCode = this.data.areaList["code"][e.currentTarget.dataset.index]

      var addressArr = [this.data.selecteProvince, this.data.selecteCity, areaName]

      var fullAddress = this.data.selecteProvince + this.data.selecteCity + areaName

      var pages = getCurrentPages()

      var pageNumber = pages.length

      var selecteAddressPage = pages[pageNumber - 4]

      selecteAddressPage.setData({ address: fullAddress, addressCode: areaCode, addressArr: addressArr})

      wx.navigateBack({
        delta:3
      })

    }
  }

})