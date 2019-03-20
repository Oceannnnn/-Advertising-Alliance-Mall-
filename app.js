//app.js
const util = require('utils/util.js');
App({
  onLaunch: function(op) {
    this.init()
  },
  globalData: {
    userInfo: null,
    state: 0,
    phone: "",
    token: '',
    distributor: 0,
    balance: 0,
    integral: 0,
    globalFormIds: [],
    ad_storelist: [{
        text: '附近的店',
        id: 1,
        type: "distance"
      }, {
        text: '人气排行',
        id: 2,
        type: "visitor"
      },
      // {
      //   text: '领券排行',
      //   id: 3
      // }
    ],
    stick: 0,
    latitude: '',
    longitude: ''
  },
  init() {
    if (wx.getStorageSync('httpClient')) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.userInfo = wx.getStorageSync('httpClient').userInfo;
      this.globalData.distributor = wx.getStorageSync('httpClient').distributor;
      this.globalData.stick = wx.getStorageSync('stick');
      this.globalData.balance = wx.getStorageSync('member').balance;
      this.globalData.integral = wx.getStorageSync('member').integral;
    }
    if (wx.getStorageSync('token')) this.globalData.token = wx.getStorageSync('token')
    if (wx.getStorageSync('degree')) {
      this.globalData.latitude = wx.getStorageSync('degree').latitude;
      this.globalData.longitude = wx.getStorageSync('degree').longitude;
    }
  }
})