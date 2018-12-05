// pages/mine/editeMyReleaseQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exsitImgCount: 0,
    questionId: -1,
    originQuestionData: {},

    province: "",
    city: "",
    district: "",
    street: "",
    location: "获取中...",
    addPicCount: 0,
    pictures: [{
      hidden: true,
      url: "",
      isServerImg: false
    }, {
      hidden: true,
      url: "",
      isServerImg: false
    }, {
      hidden: true,
      url: "",
      isServerImg: false
    }],
    title: "",
    detail: "",
    relateCrop: "",
    deleteImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.data.questionId = options.questionId

    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getQuestionDetail({
      questionId: self.data.questionId,
      success: function(p) {
        wx.hideLoading()

        if (p.data.images) {
          p.data.images = p.data.images.split(",")
        } else {
          p.data.images = []
        }

        self.data.originQuestionData = p.data

        for (var i = 0; i < p.data.images.length; i++) {
          var imgUrl = p.data.images[i]
          if (i > 2) {
            break
          }
          self.data.pictures[i].hidden = false
          self.data.pictures[i].url = imgUrl
          self.data.pictures[i].isServerImg = true
        }

        self.data.province = p.data.province
        self.data.city = p.data.city
        self.data.district = p.data.area
        self.data.street = p.data.street
        self.data.exsitImgCount = p.data.images.length
        self.setData({
          title: p.data.title,
          detail: p.data.questionIntro,
          relateCrop: p.data.relativeCrops,
          location: (p.data.province + p.data.city + p.data.area),
          pictures: self.data.pictures,
          exsitImgCount: self.data.exsitImgCount
        })

      },
      fail: function(p) {
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: '../../images/mine/fail.png',
          duration: 1500
        })
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  addMorePic: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var image = res.tempFiles[0]
        if (image.size > 4 * 1024 * 1024) {
          wx.showModal({
            title: '提示',
            content: '图片大小超过规定范围,请重新选择!',
            showCancel: false
          })
          return
        }
        var picture = self.data.pictures[self.data.exsitImgCount]
        picture.hidden = false
        picture.url = image.path
        picture.isServerImg = false
        self.data.addPicCount += 1
        self.data.exsitImgCount += 1
        self.setData({
          pictures: self.data.pictures,
          exsitImgCount: self.data.exsitImgCount
        })
      },
      fail: function(e) {
        wx.showModal({
          title: '提示',
          content: e.errMsg,
          showCancel: false
        })
      }
    })
  },
  deletePic: function(e) {
    var index = e.currentTarget.dataset.index
    var pic = this.data.pictures[index]
    this.data.exsitImgCount -= 1

    if (pic.isServerImg) {
      this.data.deleteImages.push(pic.url)
      this.data.pictures.splice(index, 1)
      this.data.pictures.push({
        hidden: true,
        url: "",
        isServerImg: false})

      this.setData({
        pictures: this.data.pictures,
        exsitImgCount: this.data.exsitImgCount
      })
    } else {
      this.data.pictures.splice(index, 1)
      this.data.pictures.push({
        hidden: true,
        url: "",
        isServerImg: false
      })
      this.data.addPicCount -= 1
      this.setData({
        pictures: this.data.pictures,
        exsitImgCount: this.data.exsitImgCount
      })
    }
  },

  titleInputAction: function(e) {
    this.data.title = e.detail.value
  },

  detailInputAction: function(e) {
    this.data.detail = e.detail.value
  },

  relateCropInputAction: function(e) {
    this.data.relateCrop = e.detail.value
  },

  releaseQuestion: function() {
    if (this.data.questionId == -1) {
      return
    }
    
    if (this.data.title.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请简单的描述您的问题!',
        showCancel: false
      })
      return
    }

    if (this.data.networkState == -2) {
      return
    }

    this.data.networkState = -2

    var self = this
    wx.showLoading({
      title: '发布中...',
    })
    var deleteImages = ""
    for (var i = 0; i < this.data.deleteImages.length; i++) {
      deleteImages = deleteImages + this.data.deleteImages[i]
      if (i != (this.data.deleteImages.length - 1)) {
        deleteImages = deleteImages + ","
      }
    }
    var networkH = require("../../utils/networkHandle.js")
    networkH.editQuestion({
      questionId: self.data.questionId,
      title: self.data.title,
      questionIntro: self.data.detail,
      relativeCrops: self.data.relateCrop,
      province: self.data.province,
      city: self.data.city,
      area: self.data.district,
      address: self.data.street,
      deleteImages: deleteImages,
      success: function(p) {

        if (self.data.addPicCount == 0) {

          wx.hideLoading()

          wx.showToast({
            title: '发布成功',
            image: '../../images/mine/success.png',
            duration: 1500
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 0
            })
          }, 2000)
        } else {

          var questionId = self.data.questionId

          var uploadCount = 0
          var myNetworkH = require("../../utils/networkHandle.js")
          for (var i = 0; i < self.data.pictures.length; i++) {
            if (self.data.pictures[i].hidden == false && self.data.pictures[i].isServerImg == false) {
              var imgPath = self.data.pictures[i].url
              myNetworkH.uploadImgForQuestion({
                questionId: questionId,
                filePath: imgPath,
                success: function(q) {
                  uploadCount++
                  if (uploadCount == self.data.addPicCount) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '编辑成功',
                      image: '../../images/mine/success.png',
                      duration: 1500
                    })
                    setTimeout(function() {
                      wx.navigateBack({
                        delta: 0
                      })
                    }, 2000)
                  }
                },
                fail: function(q) {

                  uploadCount++
                  if (uploadCount == self.data.addPicCount) {
                    wx.hideLoading()

                    wx.showToast({
                      title: '编辑成功',
                      image: '../../images/mine/success.png',
                      duration: 1500
                    })
                    setTimeout(function() {
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
      fail: function(p) {
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: '../../images/mine/fail.png',
          duration: 1500
        })

      }
    })

  },

  deleteQuestion: function() {
    if (this.data.questionId == -1){
      return
    }
    var self = this
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '删除中...',
          })
          var networkH = require("../../utils/networkHandle.js")
          networkH.deleteMyQuestion({
            questionId:self.data.questionId,
            success:function(e){
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
            fail:function(e){
              wx.hideLoading()
              wx.showToast({
                title: e.errorMsg,
                image: '../../images/mine/fail.png',
                duration: 1500
              })
            }
          })
        }else{
          
        }
      }
    })
  }


})