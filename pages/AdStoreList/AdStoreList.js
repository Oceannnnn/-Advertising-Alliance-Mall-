// pages/my/my.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    main.uploadFormIds();
    this.init(op.id);
    main.uploadFormIds();
  },
  init(id){
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setData({
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
      addressMuse: app.globalData.addressMuse,
      provinces: app.globalData.provinces,
      citys: app.globalData.citys,
      cate_id:id
    })
  },
  onShow() {
    this.city();
  },
  city() {
    let city_id = this.data.city_id;
    let cate_id = this.data.cate_id;
    if (wx.getStorageSync('city')) {
      let location = wx.getStorageSync('city').location;
      city_id = wx.getStorageSync('city').city_id;
      this.setData({
        location: location,
        city_id: city_id
      })
    }
    this.adList("distance", 1, city_id, cate_id)
  },
  bindtapAd(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let city_id = this.data.city_id;
    let cate_id = this.data.cate_id;
    this.setData({
      currentId: id,
      type: type,
      page: 1,
      onBottom: true,
      adList: []
    })
    this.adList(type, 1, city_id, cate_id)
  },
  adList(type, page, city_id, cate_id) {
    let lat = this.data.latitude;
    let lng = this.data.longitude;
    let json = {
      type: type,
      size: 10,
      page: page,
      lat: lat,
      lng: lng,
      city_id: city_id,
      guild: "" ,
      cate_id: cate_id
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
  ad_init(that) {
    that.setData({
      page: 1,
      onBottom: true,
      adList: []
    })
  },
  bindtapStore(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "adStore")
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.adList(this.data.type, this.data.page, this.data.city_id, this.data.cate_id)
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
    let cate_id = this.data.cate_id;
    let type = this.data.type;
    this.adList(type, 1, city_id, cate_id)
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
})