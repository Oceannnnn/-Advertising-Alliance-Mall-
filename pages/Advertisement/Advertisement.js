// pages/balance/balance.js
const util = require('../../utils/util.js')
const main = require('../../utils/main.js')
const app = getApp()
Page({
  data: {
    cate: []
  },
  onLoad(op) {
    this.init() //guild，1是广告，2是家装
    this.scene(op); //分销二维码扫描进入
  },
  init() {
    this.getCompanyConfig() //联系我们
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setData({
      storeList: [],
      animationAddressMenu: {},
      addressMenuIsShow: false,
      value: [0, 0],
      provinces: [],
      citys: [],
      province: '',
      city: '',
      page: 1,
      onBottom: true,
      currentId: 1,
      adList: [],
      type: "distance",
      location: '全国',
      city_id: 9999,
      stick: app.globalData.stick,
      ad_list: app.globalData.ad_storelist,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    })
    util.http('ad/region', {}, 'get').then(res => {
      if (res.code == 200) {
        let addressMuse = res.data
        // 默认联动显示全国
        var id = addressMuse.province[0].id;
        let provinces = addressMuse.province;
        let citys = addressMuse.citys[id];
        app.globalData.addressMuse = addressMuse;
        app.globalData.provinces = provinces;
        app.globalData.citys = citys;
        this.setData({
          addressMuse: addressMuse,
          provinces: provinces,
          citys: citys,
        })
      }
    })
    util.http('ad/nav', {
      guild: 1
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          cate: res.data
        })
      }
    })
    util.http('ad/banner', {
      guild: 1
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    util.http('ad/notice', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          textList: res.data
        })
      }
    })
    util.http('ad/recommend_store', {
      guild: 1
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          storeList: res.data
        })
      }
    })
  },
  onShow() {
    let that = this;
    if (!wx.getStorageSync('degree')) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          app.globalData.latitude = latitude;
          app.globalData.longitude = longitude;
          wx.setStorage({
            key: "degree",
            data: {
              latitude: latitude,
              longitude: longitude
            },
          })
          that.setData({
            currentId: 1,
            latitude: latitude,
            longitude: longitude
          })
          let city_id = that.data.city_id;
          that.ad_init(that);
          that.adList("distance", 1, city_id)
        }
      })
    }
    this.getTokenFromServer();
    this.city();
  },
  city() {
    this.setData({
      stick: app.globalData.stick,
    })
    let city_id = this.data.city_id;
    if (wx.getStorageSync('city')) {
      let location = wx.getStorageSync('city').location;
      city_id = wx.getStorageSync('city').city_id;
      this.setData({
        location: location,
        city_id: city_id
      })
    }
    this.ad_init(this);
    this.adList("distance", 1, city_id)
  },
  ad_init(that) {
    that.setData({
      page: 1,
      onBottom: true,
      adList: []
    })
  },
  bindtapAd(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let city_id = this.data.city_id;
    this.setData({
      currentId: id,
      type: type,
      page: 1,
      onBottom: true,
      adList: []
    })
    this.adList(type, 1, city_id)
  },
  adList(type, page, city_id) {
    let lat = this.data.latitude;
    let lng = this.data.longitude;
    let json = {
      type: type,
      size: 10,
      page: page,
      lat: lat,
      lng: lng,
      city_id: city_id,
      guild: 1,
      cate_id: ''
    }
    let list = this.data.adList;
    let token = app.globalData.token;
    util.http('ad/store_list', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            adList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  bindEnter(e) {
    if (app.globalData.state == 1) {
      if (app.globalData.stick == 1) {
        wx.navigateTo({
          url: '../adMyStore/adMyStore'
        })
      } else {
        main.toDetails(e, "AdSettled")
      }
    } else {
      login(e)
    }
  },
  bindNotice(e) {
    main.toDetails(e, "adNotice")
  },
  bindtapStore(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    if (app.globalData.state == 1) {
      main.toDetails(e, "adStore")
    } else {
      login(e)
    }
  },
  bindtapStoreList(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "AdStoreList")
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.adList(this.data.type, this.data.page, this.data.city_id)
    }
  },
  // 点击所在地区弹出选择框
  selectDistrict(e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation(isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(200 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure(e) {
    var city = this.data.city;
    var value = this.data.value;
    this.startAddressAnimation(false);
    // 将选择的城市信息显示到输入框
    var city = this.data.citys[value[1]].name;
    let city_id = this.data.citys[value[1]].id
    this.setData({
      location: city,
      city_id: city_id
    })
    wx.setStorage({
      key: "city",
      data: {
        location: city,
        city_id: city_id
      }
    })
    this.ad_init(this);
    let type = this.data.type;
    this.adList(type, 1, city_id)
  },
  // 处理省市县联动逻辑
  cityChange(e) {
    let addressMuse = this.data.addressMuse;
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var provinceNum = value[0]
    var cityNum = value[1]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0],
        citys: addressMuse.citys[id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum]
      })
    }
  },
  getCompanyConfig() {
    let token = app.globalData.token;
    util.http('about/index', {}, 'get', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.name;
        app.globalData.phone = info.mobile;
        app.globalData.logo = info.logo;
      }
    })
  },
  getTokenFromServer(callBack) {
    var that = this;
    let token = "";
    wx.login({
      success: function(res) {
        wx.setStorageSync('code', res.code);
        util.http('login/getToken', {
          code: res.code
        }, 'post', token).then(data => {
          wx.setStorageSync('token', data.token);
          callBack && callBack(data.token);
          app.globalData.token = data.token;
        })
      }
    })
  },
  scene(op) {
    let scene = '';
    if (op.scene) {
      scene = decodeURIComponent(op.scene);
    }
    if (op.invite_code) {
      scene = op.invite_code
    }
    wx.setStorage({
      key: 'scene',
      data: scene
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init();
    this.city();
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShareAppMessage() {
    let invite_code = ""
    if (wx.getStorageSync("invite_code")) {
      invite_code = wx.getStorageSync("invite_code");
    }
    return {
      title: '联盟分享指南：点开允许--加盟申请--允许--详填资料--提交成功！',
      path: '/pages/Advertisement/Advertisement?invite_code=' + invite_code
    }
  }
})

function login(e) {
  let scene = '';
  if (wx.getStorageSync('scene')) {
    scene = wx.getStorageSync('scene')
  }
  wx.login({
    success: function(res) {
      let code = res.code
      wx.getSetting({
        success(res) {
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
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(() => {
                      wx.switchTab({
                        url: '../Advertisement/Advertisement'
                      })
                    }, 500)
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
}
module.exports = {
  login: login
}