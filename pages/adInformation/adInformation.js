// pages/adStore/adStore.js
const app = getApp();
const util = require('../../utils/util.js');
const advertisement = require('../Advertisement/Advertisement.js')
const main = require('../../utils/main.js');
Page({
  data: {
    dynamicList: [],
  },
  onLoad(op) {
    this.init()
  },
  init() {
    this.setData({
      page: 1,
      onBottom: true,
      currentId: 1,
      type: "",
      ad_list: [{
          text: '推荐',
          id: 1,
          type: ""
        },
        {
          text: '热帖',
          id: 2,
          type: "1"
        }
      ],
    })
    util.http('ad/nav', {
      guild: 3
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          cate: res.data
        })
      }
    })
    util.http('ad/banner', {
      guild: 3
    }, 'post').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    this.dynamicList("", 1)
  },
  dynamicList(type, page) {
    let json = {
      type: type,
      size: 10,
      page: page,
      cate_id: ''
    }
    let list = this.data.dynamicList;
    let token = app.globalData.token;
    util.http('article/index', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            dynamicList: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.dynamicList(this.data.type, this.data.page)
    }
  },
  toCall(e) {
    let mobile = e.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  bindtapAd(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    this.setData({
      currentId: id,
      type: type,
      page: 1,
      onBottom: true,
      dynamicList: []
    })
    this.dynamicList(type, 1)
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = e.currentTarget.dataset.arr;
    let imgArr = [];
    for (var i = 0; i < arr.length; i++) {
      imgArr.push(arr[i].image)
    }
    wx.previewImage({
      current: imgArr[index], //当前图片地址 
      urls: imgArr, //所有要预览的图片的地址集合 数组形式 
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  adMold() {
    if (app.globalData.state == 1) {
      wx.navigateTo({
        url: '../adMold/adMold?type=1'
      })
    } else {
      advertisement.login(e)
    }
  },
  collect(e) {
    if (app.globalData.state == 1) {
      let token = app.globalData.token;
      let collect = e.currentTarget.dataset.collect;
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let head_img = e.currentTarget.dataset.head_img;
      let dynamicList = this.data.dynamicList;
      if (collect == 0) {
        dynamicList[index].is_zan = 1;
        let json = {
          head_img: head_img,
        }
        dynamicList[index].zan_img.unshift(json);
        this.setData({
          dynamicList: dynamicList
        })
        util.http('article/add_zan', { id: id }, 'post', token).then(res => {
          if (res.code == 200) { }
        })
      } else {
        wx.showToast({
          title: '已点过赞',
          icon: 'none'
        })
      }
    } else {
      main.goLogin(1)
    }
  },
  add_plun(e) {
    if (app.globalData.state == 1) {
      let comment = e.detail.value;
      let token = app.globalData.token;
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      let nick_name = e.currentTarget.dataset.nick_name; 
      let dynamicList = this.data.dynamicList;
      let json = {
        nick_name: nick_name,
        comment: comment
      }
      util.http('article/add_plun', { id: id, comment: comment}, 'post', token).then(res => {
        if (res.code == 200) {
          dynamicList[index].plun.unshift(json);
          this.setData({
            dynamicList: dynamicList,
            value: ''
          })
        }
      })
    } else {
      main.goLogin(1)
    }
  },
  todetails(e) {
    main.toDetails(e, "adtodetails")
  },
  bindtapDynamic(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "adDynamicList")
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
})