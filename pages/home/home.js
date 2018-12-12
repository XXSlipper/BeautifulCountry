// pages/hone/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    topSwiperH: 150,

    frashMoveView: false,

    isClickedSeg: false,

    isLoadingMoreList: false,

    isloadingListOver: false,

    loadingOverFlags: [false, false, false, false, false],

    hiddenSearchBar: true,

    interval: 2000,
    duration: 500,

    segContentWidth: 0,
    segSelectedIndex: 0,
    moveViewWidth: 32,
    moveViewXLocation: 8,

    oldScrollTop: 0,
    stopOnTop: false,

    newsListSwiperH: 0,

    imagesInfo: [{
      imgUrl: ""
      },
      {
        imgUrl: ""
      },
      {
        imgUrl: ""
      }
    ],

    segmentTitles: [{
        title: "民生",
        width: 32
      },
      {
        title: "军事",
        width: 32
      },
      {
        title: "创业致富",
        width: 64
      },
      {
        title: "你问我答",
        width: 64
      },
      {
        title: "乡村公告",
        width: 64
      }
    ],

    networkState: [{
      state: -1
    }, {
      state: -1
    }, {
      state: -1
    }, {
      state: -1
    }, {
      state: -1
    }], //-2 网络请求中, -1 未加载, 0 请求失败, 1请求成功

    minshengList: [], //[{articleId:1,baseUrl:"",coverImgName,time:145232,title:"",type:"news"}]
    minshengListPage: -1,

    junshiList: [],
    junshiListPage: -1,

    chuangyeList: [],
    chuangyeListPage: -1,

    questionList: [],
    questionListPage: -1,

    publicNoticeList: [],
    publicNoticeListPage: -1,
    isGetLocation: -1
  },

  refreshSegView: function(index) {
    let [titles, moveViewWidth, moveViewLocation_x, newsListSwiperH] = [this.data.segmentTitles, 0, 0, 0]

    for (let i = 0; i < titles.length; i++) {
      if (i < index) {
        moveViewLocation_x += titles[i].width
      }
    }

    moveViewLocation_x += (8 + index * 16)

    moveViewWidth = titles[index].width

    // movable-view 改变moveView 的位置和大小的时候有bug
    //下面实行暴力刷新
    this.setData({
      segSelectedIndex: index,
      moveViewWidth: moveViewWidth
    })
    this.setData({
      frashMoveView: !this.data.frashMoveView
    })
    this.setData({
      moveViewXLocation: moveViewLocation_x
    })

    //计算swiper高度
    if (index == 0) {
      newsListSwiperH = 85 * this.data.minshengList.length

      var miniH = wx.getSystemInfoSync().windowHeight - 48 - this.data.topSwiperH
      if (newsListSwiperH < miniH) {
        newsListSwiperH = miniH
      }

      this.setData({
        hiddenSearchBar: true,
        newsListSwiperH: newsListSwiperH
      })

    } else if (index == 1) {
      newsListSwiperH = 85 * this.data.junshiList.length

      var miniH = wx.getSystemInfoSync().windowHeight - 48 - this.data.topSwiperH
      if (newsListSwiperH < miniH) {
        newsListSwiperH = miniH
      }

      this.setData({
        hiddenSearchBar: true,
        newsListSwiperH: newsListSwiperH
      })

    } else if (index == 2) {
      newsListSwiperH = 85 * this.data.chuangyeList.length

      var miniH = wx.getSystemInfoSync().windowHeight - 48 - this.data.topSwiperH
      if (newsListSwiperH < miniH) {
        newsListSwiperH = miniH
      }

      this.setData({
        hiddenSearchBar: true,
        newsListSwiperH: newsListSwiperH
      })

    } else if (index == 3) {
      var self = this
      var query1 = wx.createSelectorQuery()
      query1.select('.questionContainer').boundingClientRect(function(rect1) {

        newsListSwiperH = rect1.height

        var miniH = wx.getSystemInfoSync().windowHeight - 48 - self.data.topSwiperH
        if (newsListSwiperH < miniH) {
          newsListSwiperH = miniH
        }

        self.setData({
          hiddenSearchBar: false,
          newsListSwiperH: newsListSwiperH
        })

      }).exec()
    } else {
      newsListSwiperH = 0

      var miniH = wx.getSystemInfoSync().windowHeight - 48 - this.data.topSwiperH
      if (newsListSwiperH < miniH) {
        newsListSwiperH = miniH
      }

      this.setData({
        hiddenSearchBar: true,
        newsListSwiperH: newsListSwiperH
      })

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var totalLen = 0
    var titles = this.data.segmentTitles
    totalLen += titles.length * 16

    for (let i = 0; i < titles.length; i++) {
      totalLen += titles[i].width
    }

    let windowWidth = wx.getSystemInfoSync().windowWidth

    this.setData({
      segContentWidth: windowWidth > totalLen ? windowWidth : totalLen
    })

    var self = this
    var query = wx.createSelectorQuery()
    query.select('.swiperSection').boundingClientRect(function(rect) {

      self.data.topSwiperH = rect.height


      self.loadDataWithIndexAndPage(0, 0, false, false)

    }).exec()

    this.loadUpSwiperData()
  },

  loadUpSwiperData:function(){
    var self = this
    var networkH = require("../../utils/networkHandle.js")
    networkH.getBannerList({
      success: function (e) {
        self.setData({
          imagesInfo:e.data
        })
      },
      fail: function (e) {

      }
    })
  },

  loadDataWithIndexAndPage: function(index, page, isPullDown, isReachBottom) {

    var networkState = this.data.networkState[index].state

    if (networkState == -2) { //网络请求中,返回
      this.refreshSegView(index)
      if (isPullDown) {
        wx.stopPullDownRefresh()
      }
      return
    }

    if (index == 0 | index == 1 | index == 2) {

      var myType = ""
      if (index == 0) {
        myType = "minsheng"

        if (this.data.minshengListPage >= page) {
          this.refreshSegView(index)
          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          return
        }
      } else if (index == 1) {
        myType = "junshi"

        if (this.data.junshiListPage >= page) {
          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          this.refreshSegView(index)
          return
        }

      } else if (index == 2) {
        myType = "chuangye"

        if (this.data.chuangyeListPage >= page) {
          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          this.refreshSegView(index)
          return
        }

      }

      if (isPullDown == false && isReachBottom == false) {
        wx.showLoading({
          title: '加载中...'
        })
      }

      this.data.networkState[index].state = -2 //将标识设置为请求中
      var self = this
      var networkHandle = require("../../utils/networkHandle.js")
      networkHandle.getArticleList({
        type: myType,
        page:page,
        success: function(e) {
          self.data.networkState[index].state = 1 //将标识设置为成功

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }

          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }

          var util = require("../../utils/util.js")
          for (var i = 0; i < e.data.list.length; i++) {
            e.data.list[i].time = util.changeTimeNumToTimeAgo(e.data.list[i].time)
          }
          if (e.data.list.length == 0) {
            self.data.loadingOverFlags[index] = true
            if (isReachBottom) {
              self.setData({
                isloadingListOver: true
              })
              setTimeout(function() {
                self.setData({
                  isLoadingMoreList: false
                })
              }, 1500)
            }
          } else {
            self.data.loadingOverFlags[index] = false
            if (isReachBottom) {
              self.setData({
                isloadingListOver: false
              })
              setTimeout(function() {
                self.setData({
                  isLoadingMoreList: false
                })
              }, 1500)
            }
          }

          if (index == 0) {
            self.data.minshengListPage = page
            var newMingshengList = self.data.minshengList.concat(e.data.list)
            self.setData({
              minshengList: newMingshengList
            })
          } else if (index == 1) {
            self.data.junshiListPage = page
            var newJunshiList = self.data.junshiList.concat(e.data.list)
            self.setData({
              junshiList: newJunshiList
            })
          } else if (index == 2) {
            self.data.chuangyeListPage = page
            var newChuangyeList = self.data.chuangyeList.concat(e.data.list)
            self.setData({
              chuangyeList: newChuangyeList
            })
          }
          self.refreshSegView(index)

        },
        fail: function(e) {

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }

          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }

          if (isReachBottom) {
            self.setData({
              isLoadingMoreList: false
            })
          }

          self.data.networkState[index].state = 0 //将标识设置为失败
          self.refreshSegView(index)
          if (index == 0) {
            self.setData({
              minshengList: self.data.minshengList
            })
          } else if (index == 1) {
            self.setData({
              junshiList: self.data.junshiList
            })
          } else if (index == 2) {
            self.setData({
              chuangyeList: self.data.chuangyeList
            })
          }
          wx.showToast({
            title: e.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      })
    } else if (index == 3) {

      if (this.data.questionListPage >= page) {
        this.refreshSegView(index)
        return
      }
      if (isPullDown == false && isReachBottom == false) {
        wx.showLoading({
          title: '加载中...'
        })
      }
      this.data.networkState[index].state = -2 //将标识设置为请求中
      var self = this
      var networkHandle = require("../../utils/networkHandle.js")
      networkHandle.getQuestionList({
        page: page,
        success: function(e) {

          self.data.questionListPage = page
          self.data.networkState[index].state = 1 //将标识设置为成功

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }

          if (e.data.list.length == 0) {
            self.data.loadingOverFlags[index] = true
            if (isReachBottom) {
              self.setData({
                isloadingListOver: true
              })
              setTimeout(function() {
                self.setData({
                  isLoadingMoreList: false
                })
              }, 1500)
            }
          } else {
            self.data.loadingOverFlags[index] = false
            if (isReachBottom) {
              self.setData({
                isloadingListOver: false
              })
              setTimeout(function() {
                self.setData({
                  isLoadingMoreList: false
                })
              }, 1500)
            }
          }
          var newQuestionList = self.data.questionList.concat(e.data.list)

          self.setData({
            questionList: newQuestionList
          })
          self.refreshSegView(index)
        },
        fail: function(e) {

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }

          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }


          if (isReachBottom) {
            self.setData({
              isLoadingMoreList: false
            })
          }

          self.data.networkState[index].state = 0 //将标识设置为失败
          self.refreshSegView(index)
          wx.showToast({
            title: e.errorMsg,
            image: "../../images/mine/fail.png",
            duration: 1500
          })
        }
      })
    } else {

      var self = this
      var networkH = require("../../utils/networkHandle.js")
      networkH.accessAndAnalysisLocation({
        success: function(e) {
          var locationStr = e.data.province + "|" + e.data.city + "|" + e.data.district + "|" + e.data.street

          if (isPullDown) {
            wx.stopPullDownRefresh()
          }
          if (isPullDown == false && isReachBottom == false) {
            wx.hideLoading()
          }
          
          //根据地址获取当地乡镇发布的公告
          self.setData({
            isGetLocation: 1,
            publicNoticeList: []
          })
        },
        fail: function(e) {
          self.refreshSegView(index)
          self.setData({
            isGetLocation: 0
          })
        }
      })

      this.refreshSegView(index)
    }

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

    var index = this.data.segSelectedIndex

    this.data.loadingOverFlags[index] = false

    switch (index) {
      case 0:
        {
          this.data.minshengListPage = -1
          this.data.minshengList = []
        }
        break;
      case 1:
        {
          this.data.junshiListPage = -1
          this.data.junshiList = []
        }
        break;
      case 2:
        {
          this.data.chuangyeListPage = -1
          this.data.chuangyeList = []
        }
        break;
      case 3:
        {
          this.data.questionListPage = -1
          this.data.questionList = []
        }
        break;


    }

    this.loadDataWithIndexAndPage(this.data.segSelectedIndex, 0, true, false)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    
    var index = this.data.segSelectedIndex
    switch (index) {
      case 0:
        {
          if (this.data.loadingOverFlags[index]) {
            this.setData({
              isLoadingMoreList: true,
              isloadingListOver: true
            })
            var self = this
            setTimeout(function () {
              self.setData({
                isLoadingMoreList: false
              })
            }, 1500)

            return
          }

          this.setData({
            isLoadingMoreList: true,
            isloadingListOver: false
          })

          var page = this.data.minshengListPage + 1
          this.loadDataWithIndexAndPage(index, page, false, true)

        }
        break;
      case 1:
        {
          if (this.data.loadingOverFlags[index]) {
            this.setData({
              isLoadingMoreList: true,
              isloadingListOver: true
            })
            var self = this
            setTimeout(function () {
              self.setData({
                isLoadingMoreList: false
              })
            }, 1500)

            return
          }

          this.setData({
            isLoadingMoreList: true,
            isloadingListOver: false
          })

          var page = this.data.junshiListPage + 1
          this.loadDataWithIndexAndPage(index, page, false, true)

        }
        break;
      case 2:
        {
          if (this.data.loadingOverFlags[index]) {
            this.setData({
              isLoadingMoreList: true,
              isloadingListOver: true
            })
            var self = this
            setTimeout(function () {
              self.setData({
                isLoadingMoreList: false
              })
            }, 1500)

            return
          }

          this.setData({
            isLoadingMoreList: true,
            isloadingListOver: false
          })

          var page = this.data.chuangyeListPage + 1
          this.loadDataWithIndexAndPage(index, page, false, true)

        }
        break;
      case 3:
        {
          if (this.data.loadingOverFlags[index]) {
            this.setData({
              isLoadingMoreList: true,
              isloadingListOver: true
            })
            var self = this
            setTimeout(function () {
              self.setData({
                isLoadingMoreList: false
              })
            }, 1500)

            return
          }

          this.setData({
            isLoadingMoreList: true,
            isloadingListOver: false
          })
          var page = this.data.questionListPage + 1
          this.loadDataWithIndexAndPage(index, page, false, true)
        }
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //轮播图片点击事件
  gotoDetailInfoPage: function(e) {
    let index = e.currentTarget.dataset.index
    var obj = this.data.imagesInfo[index]
    if(obj.imgUrl && obj.imgUrl.length > 0){

      if (obj.questionId > 0){

        wx.navigateTo({
          url: 'questionDetail?questionId=' + obj.questionId,
        })

      } else if (obj.supplyDemandId > 0){

        var myType = 0
        if (obj.supplyDemandType === "supply"){
          myType = 1
        }else{
          myType = 0
        }
        wx.navigateTo({
          url: '../market/buyAndPayDetail?supplyDemandId=' + obj.supplyDemandId + "&isSupply=" + myType,
        })

      } else if (obj.articleId > 0){

        wx.navigateTo({
          url: 'newsDetail?articleId=' + obj.articleId,
        })

      }else{

      }

    }
  },

  //分区栏按钮点击事件
  clickedOnSeg: function(e) {

    this.data.isClickedSeg = true

    this.setData({
      segSelectedIndex: e.currentTarget.dataset.index
    })

    this.loadDataWithIndexAndPage(e.currentTarget.dataset.index, 0, false, false)

  },

  //手势左右滑动分区内容页
  listSwiperChange: function(e) {
    if (this.data.isClickedSeg == true) {
      this.data.isClickedSeg = false
      return
    }
    this.setData({
      segSelectedIndex: e.detail.current
    })
    this.loadDataWithIndexAndPage(e.detail.current, 0, false, false)
  },
  //监听屏幕滚动 判断上下滚动
  onPageScroll: function(ev) {

    //当滚动的top值最大或最小时，为什么要做这一步是因为在手机实测小程序的时候会发生滚动条回弹，所以为了处理回弹，设置默认最大最小值
    if (ev.scrollTop <= 0) {
      ev.scrollTop = 0
    } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
      ev.scrollTop = wx.getSystemInfoSync().windowHeight
    }
    let stopOnTop = false
    if (ev.scrollTop >= this.data.topSwiperH) {
      stopOnTop = true
    } else {
      stopOnTop = false
    }

    this.data.oldScrollTop = ev.scrollTop
    this.setData({
      stopOnTop: stopOnTop
    })

  },

  clickOnNewsList: function(e) {
    var articleId = e.currentTarget.dataset.articleId
    wx.navigateTo({
      url: 'newsDetail?articleId=' + articleId,
    })
  },

  tapOnQuestionCell: function(e) {
    var questionId = e.currentTarget.dataset.questionId
    wx.navigateTo({
      url: 'questionDetail?questionId=' + questionId,
    })
  },

  questionImgLoadFail: function(e) {
    var index = e.currentTarget.dataset.index
    var question = this.data.questionList[index]
    question.images = "../../images/home/imgLoadError.png"
    this.setData({
      questionList: this.data.questionList
    })
  },

  getLocationAgain:function(){

  },

  call:function(e){
    var phoneNumber = e.currentTarget.dataset.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
      success: function (p) {

      },
      fail: function (p) {

      }
    })
  },

  searchQuestionAction:function(){
    wx.navigateTo({
      url: 'searchQuestion'
    })
  }

})