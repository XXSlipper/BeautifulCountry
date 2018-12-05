// pages/release/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    networkState:-1,
    province:"",
    city:"",
    district:"",
    street:"",
    location:"获取中...",
    addPicCount:0,
    pictures: [{ hidden: true, url: "" }, { hidden: true, url: "" }, { hidden: true, url: "" }],
    title:"",
    detail:"",
    relateCrop:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.accessAndAnalysisLocation({
      success:function(e){
        var locationStr = e.data.province + "|" + e.data.city + "|" + e.data.district
        self.setData({ location: locationStr})
        self.data.province = e.data.province
        self.data.city = e.data.city
        self.data.district = e.data.district
        self.data.street = e.data.street
      },
      fail:function(e){
        self.setData({ location: "获取失败" })
        
      }
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

  addMorePic:function(){
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var image = res.tempFiles[0]
        if(image.size > 4*1024*1024){
          wx.showModal({
            title: '提示',
            content: '图片大小超过规定范围,请重新选择!',
            showCancel:false
          })
          return
        }


        var picture = self.data.pictures[self.data.addPicCount]
        picture.hidden = false
        picture.url = image.path
        self.data.addPicCount += 1
        self.setData({ pictures: self.data.pictures, addPicCount: self.data.addPicCount})
      },
      fail:function(e){
        wx.showModal({
          title: '提示',
          content: e.errMsg,
          showCancel: false
        })
      }
    })
  },
  deletePic:function(e){
    var index = e.currentTarget.dataset.index
    this.data.pictures.splice(index, 1)
    this.data.pictures.push({
      hidden: true,
      url: ""
    })
    this.data.addPicCount -= 1
    this.setData({ pictures: this.data.pictures, addPicCount: this.data.addPicCount})
  },

  titleInputAction:function(e){
    this.data.title = e.detail.value
  },
  detailInputAction:function(e){
    this.data.detail = e.detail.value
  },
  relateCropInputAction:function(e){
    this.data.relateCrop = e.detail.value
  },

  releaseQuestion: function () {
    
    if(this.data.title.length <= 0){
      wx.showModal({
        title: '提示',
        content: '请简单的描述您的问题!',
        showCancel:false
      })
      return
    }

    if (this.data.networkState == -2){
      return
    }

    this.data.networkState = -2

    var self = this
    wx.showLoading({
      title: '发布中...',
    })
    var networkH = require("../../utils/networkHandle.js")
    networkH.releaseQuestion({
      title:self.data.title,
      description: self.data.detail,
      province: self.data.province,
      city: self.data.city,
      area: self.data.district,
      address: self.data.street,
      relativeCrops: self.data.relateCrop,
      success:function(p){

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
        }else{

          var questionId = p.data.questionId

          var uploadCount = 0
          var myNetworkH = require("../../utils/networkHandle.js")
          for (var i = 0; i < self.data.pictures.length; i++) {
            if (self.data.pictures[i].hidden == false) {
              var imgPath = self.data.pictures[i].url
              myNetworkH.uploadImgForQuestion({
                questionId: questionId,
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
      fail:function(p){
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image:'../../images/mine/fail.png',
          duration:1500
        })

      }
    })

  }

})

