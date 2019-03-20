// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    hasUserInfo: false,
    state: 0,
    no_read_num: 0,
    page: 1,
    onBottom: true,
    itemsList: [],
    balance: "0.00",
    integral: "0.00"
  },
  onLoad() {
    this.init()
  },
  onShow() {
    this.setData({
      page: 1,
      onBottom: true,
      itemsList: []
    })
    if (app.globalData.state == 1) {
      this.itemsList(1);
      this.info();
      this.setData({
        no_read_num: wx.getStorageSync('no_read')
      })
    }
    if (app.globalData.state == 1) {
      this.setData({
        state: 1,
        userInfo: app.globalData.userInfo
      })
    }
  },
  info() {
    let token = app.globalData.token;
    util.http('user/info', {}, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          balance: res.data.balance,
          integral: res.data.integral
        })
      }
    })
  },
  allorder(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let data = e.currentTarget.dataset;
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../allorder/allorder?id=' + data.id + '&type=' + data.type + '&allorder=' + data.allorder,
      })
    }
  },
  chatList(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../chatList/chatList'
      })
    }
  },
  adMold(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let stick = app.globalData.stick;
    if (this.data.state == 1) {
      if (stick == 1) {
        wx.navigateTo({
          url: '../adMyStore/adMyStore'
        })
      } else {
        wx.navigateTo({
          url: '../adMold/adMold?type=2'
        })
      }
    }
  },
  adMyStore(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../adMyStore/adMyStore'
      })
    }
  },
  collection(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../collection/collection'
      })
    }
  },
  cart(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.switchTab({
        url: '../cart/cart'
      })
    }
  },
  coupons(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../coupons/coupons'
      })
    }
  },
  adshop(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../adShop/adShop'
      })
    }
  },
  myadd(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../myadd/myadd'
      })
    }
  },
  getUserInfo(e) {
    let that = this;
    let scene = '';
    if (wx.getStorageSync('scene')) {
      scene = wx.getStorageSync('scene')
    }
    wx.login({
      success: function(res) {
        let code = res.code
        wx.getSetting({
          success(res) {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  let encryptedData = msg.encryptedData;
                  let iv = msg.iv;
                  let token = '';
                  let json = {
                    code: code,
                    encryptedData: encryptedData,
                    iv: iv,
                    invite_code: scene
                  }
                  json = JSON.stringify(json)
                  util.http('login/login', json, 'post', token).then(data => {
                    if (data.code == 200) {
                      main.getTokenFromServer();
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.distributor = data.data.distributor;
                      app.globalData.state = 1;
                      app.globalData.stick = data.data.stick;
                      that.setData({
                        state: 1,
                        hasUserInfo: true,
                        userInfo: e.detail.userInfo
                      })
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          state: 1,
                          userInfo: e.detail.userInfo
                        }
                      })
                      wx.setStorage({
                        key: "stick",
                        data: data.data.stick, //1是已入驻，0是为入驻
                      })
                      wx.setStorage({
                        key: "distributor",
                        data: data.data.distributor
                      })
                      wx.setStorage({
                        key: "invite_code",
                        data: data.data.invite_code
                      })
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  })
                }
              })
            } else {
              wx.showToast({
                title: '授权才能登录哦！',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  distribution(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (this.data.state == 1) {
      if (app.globalData.distributor == 1) {
        wx.navigateTo({
          url: '../distribution/distribution',
        })
      } else {
        let distributor = wx.getStorageSync('distributor');
        if (distributor == 1) {
          wx.navigateTo({
            url: '../distribution/distribution'
          })
        } else {
          wx.showModal({
            title: '提示',
            confirmText: '确认',
            content: '确认申请？',
            confirmColor: '#029F53',
            success: function(res) {
              if (res.confirm) {
                let token = app.globalData.token;
                util.http('Distributor/register', {}, 'post', token).then(res => {
                  if (res.code == 200) {
                    wx.setStorage({
                      key: "distributor",
                      data: 1
                    })
                    wx.setStorage({
                      key: "invite_code",
                      data: res.data.invite_code
                    })
                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(() => {
                      wx.navigateTo({
                        url: '../distribution/distribution'
                      })
                    }, 500)
                  }
                })
              }
            }
          })
        }
      }
    } else {
      main.goLogin()
    }
  },
  init() {
    this.setData({
      state: app.globalData.state,
      order: [{
        name: "待付款",
        icon: "daifukuan",
        allorder: "pay",
        id: 1
      }, {
        name: "待发货",
        icon: "daifahuo",
        allorder: "deliver",
        id: 2
      }, {
        name: "待收货",
        icon: "daishouhuo",
        allorder: "receive",
        id: 3
      }, {
        name: "待评价",
        icon: "daipingjia20",
        allorder: "evaluate",
        id: 4
      }, {
        name: "退换货",
        icon: "shouhou",
        allorder: "refund",
        id: 5
      }]
    })
  },
  itemsList(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.itemsList;
    let token = app.globalData.token;
    util.http('user/like_goods', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data.data != '') {
          for (let item of res.data.data) {
            list.push(item)
          }
          this.setData({
            itemsList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom: function() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.itemsList(this.data.page);
    }
  },
  details(e) {
    main.toDetails(e, "goodsDetails")
  },
})