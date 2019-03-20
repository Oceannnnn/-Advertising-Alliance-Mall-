// pages/balance/balance.js
const util = require('../../utils/util.js')
const main = require('../../utils/main.js')
const advertisement = require('../Advertisement/Advertisement.js')
const app = getApp()
Page({
  data: {
    cate: []
  },
  onLoad() {
    main.uploadFormIds();
    this.init() //guild，1是广告，2是家装
  },
  init() {
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setData({
      storeList:[],
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
      ad_list: app.globalData.ad_storelist,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      addressMuse: app.globalData.addressMuse,
      provinces: app.globalData.provinces,
      citys: app.globalData.citys,
    })
    util.http('ad/nav', {
      guild: 2
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          cate: res.data
        })
      }
    })
    util.http('ad/banner', {
      guild: 2
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    util.http('ad/recommend_store', {
      guild: 2
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          storeList: res.data
        })
      }
    })
  },
  onShow() {
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
      guild: 2,
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
      advertisement.login(e)
    }
  },
  bindtapStore(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "adStore")
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
  onShareAppMessage() {
    let invite_code = ""
    if (wx.getStorageSync("invite_code")) {
      invite_code = wx.getStorageSync("invite_code");
    }
    return {
      title: '联盟分享指南：点开允许--加盟申请--允许--详填资料--提交成功！',
      path: '/pages/Advertisement/Advertisement?invite_code=' + invite_code
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init();
    this.city();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})