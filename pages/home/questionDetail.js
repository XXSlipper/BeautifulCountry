// pages/home/questionDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionId:"",
    imageW:0,
    detailInfo:{},
    answerPage:-1,
    answerList:[],
    isLoadingMoreAnswer:false,
    isloadingAnswerOver:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.questionId = options.questionId
    var screenW = wx.getSystemInfoSync().screenWidth
    this.setData({ imageW:(screenW - 60)/3.})
  },

  loadRespondList: function(page,isReachBottom){

    var networkH = require("../../utils/networkHandle.js")
    var self = this
    networkH.getQuestionRespondList({
      page:page,
      questionId:self.data.questionId,
      success:function(e){
        self.data.answerPage = page
        var util = require("../../utils/util.js")
        for(var i = 0; i < e.data.list.length; i++){
          var answer = e.data.list[i]
          answer.createTime = util.changeTimeNumToTimeAgo(answer.createTime)
        }
        if(page == 0){
          self.data.answerList = e.data.list
        }else{
          self.data.answerList = self.data.answerList.concat(e.data.list)
        }

        if (e.data.list.length == 0) {
          self.data.isloadingAnswerOver = true
          if (isReachBottom) {
            self.setData({ isloadingAnswerOver: true })
            setTimeout(function () {
              self.setData({ isLoadingMoreAnswer : false })
            }, 1500)
          }
        } else {
          self.data.isloadingAnswerOver = false
          if (isReachBottom) {
            self.setData({ isloadingAnswerOver: false })
            setTimeout(function () {
              self.setData({ isLoadingMoreAnswer: false })
            }, 1500)
          }
        }

        self.setData({ answerList: self.data.answerList })

      },
      fail:function(e){
        wx.showToast({
          title: e.errorMsg,
          image:'../../images/mine/fail.png',
          duration:1500
        })
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
    this.data.isloadingAnswerOver = false
    this.data.answerPage = -1
    wx.showLoading({
      title: '加载中...',
    })
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getQuestionDetail({
      questionId: self.data.questionId,
      success: function (p) {
        wx.hideLoading()
        var util = require('../../utils/util.js')
        p.data.createTime = util.formatTimeNumber(p.data.createTime, "Y年M月D日")
        if (p.data.images) {
          p.data.images = p.data.images.split(",")
        } else {
          p.data.images = []
        }

        self.setData({ detailInfo: p.data })
        if (p.data.answerCount > 0) {
          self.loadRespondList(0,false)
        }
      },
      fail: function (p) {
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
    if (this.data.answerPage == -1){
      return
    }

    if (this.data.isloadingAnswerOver){
      this.setData({ isLoadingMoreAnswer: true, isloadingAnswerOver: true })
      var self = this
      setTimeout(function () {
        self.setData({ isLoadingMoreAnswer: false })
      }, 1500)
      return
    }

    this.setData({ isLoadingMoreAnswer: true, isloadingAnswerOver: false })
    var page = this.data.answerPage + 1
    this.loadRespondList(page, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  clickedOnImg:function(e){
    var index = e.currentTarget.dataset.index
    if(this.data.detailInfo.images.length > index){
      var self = this
      wx.previewImage({
        urls: self.data.detailInfo.images,
        current: self.data.detailInfo.images[index]
      })
    }
  },

  answerQuestionAction: function(e){
    var questionId = this.data.questionId
    wx.navigateTo({
      url: 'answerQuestion?questionId=' + questionId,
    })
  },

  collecteAction:function(e){
    var focusStatus = this.data.detailInfo.focusStatus
    if (focusStatus == undefined) {
      return
    }
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    if (focusStatus == true) {
      wx.showLoading({
        title: '取消中...',
      })
      networkH.cancelFocusQuestion({
        questionId: self.data.questionId,
        success: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.successMsg,
            image: '../../images/mine/success.png',
            duration: 1500
          })
          self.data.detailInfo.focusStatus = false
          self.setData({ detailInfo: self.data.detailInfo })
        },
        fail: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.errorMsg,
            image: '../../images/mine/fail.png',
            duration: 1500
          })
        }
      })
    } else {
      wx.showLoading({
        title: '收藏中...',
      })
      networkH.focusQuestion({
        questionId: self.data.questionId,
        success: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.successMsg,
            image: '../../images/mine/success.png',
            duration: 1500
          })
          self.data.detailInfo.focusStatus = true
          self.setData({ detailInfo: self.data.detailInfo })
        },
        fail: function (p) {
          wx.hideLoading()
          wx.showToast({
            title: p.errorMsg,
            image: '../../images/mine/fail.png',
            duration: 1500
          })
        }
      })
    }

  },

  againstAction:function(e){
    
    var index = e.currentTarget.dataset.index
    var answer = this.data.answerList[index]
    var answerId = answer.answerId

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    wx.showLoading({
      title: '提交中...',
    })
    networkH.againstAnswer({
      answerId: answerId,
      success: function (p) {
        wx.hideLoading()
        wx.showToast({
          title: p.successMsg,
          image: "../../images/mine/success.png"
        })

        answer.oppose = answer.oppose + 1

        self.setData({ answerList: self.data.answerList })

      },
      fail: function (p) {
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png"
        })
      }
    })
  },

  zanAction:function(e){
    var index = e.currentTarget.dataset.index
    var answer = this.data.answerList[index]
    var answerId = answer.answerId

    var self = this
    var networkH = require("../../utils/networkHandle.js")
    wx.showLoading({
      title: '提交中...',
    })
    networkH.zanAnswer({
      answerId: answerId,
      success: function (p) {
        wx.hideLoading()
        wx.showToast({
          title: p.successMsg,
          image: "../../images/mine/success.png"
        })

        answer.support = answer.support + 1

        self.setData({ answerList: self.data.answerList })

      },
      fail: function (p) {
        wx.hideLoading()
        wx.showToast({
          title: p.errorMsg,
          image: "../../images/mine/fail.png"
        })
      }
    })
  }

})