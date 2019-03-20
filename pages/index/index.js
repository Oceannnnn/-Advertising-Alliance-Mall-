//index.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    redrnvelopesClose: false,
    timer: null
  },
  onLoad(op) {
    this.init();
  },
  onShow() {
    if (app.globalData.token != "") {
      main.read()
      this.setData({
        no_read_num: wx.getStorageSync('no_read')
      })
    }
  },
  init() {
    this.setData({
      imgUrls: [],
      textList: [],
      xianList: [],
      itemsList: [],
      hasSecKill: 0,
      page: 1,
      onBottom: true,
      isPopping: true, //是否已经弹出
      animPlus: {}, //旋转动画
      animCollect: {}, //item位移,透明度
      animTranspond: {}, //item位移,透明度
    })
    util.http('home/info', {}, 'get').then(res => {
      if (res.code == 200) {
        if (res.data.banners) {
          this.setData({
            imgUrls: res.data.banners,
            adList: res.data.ad,
            textList: res.data.notice
          })
        }
      }
    })
    this.itemsList(1);
    this.cate();
    this.collageList();
    this.storeList();
  },
  itemsList(page) {
    let json = {
      size: 10,
      page: page
    }
    let list = this.data.itemsList;
    util.http('home/goods', json, 'post').then(res => {
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
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    main.toDetails(e, "goodsDetails")
  },
  times() {
    util.http('home/sec_recommend', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          xianList: res.data.item,
          time_state: parseInt(res.data.time_state)
        })
        this.countDown(res.data.time)
      }
    })
  },
  countDown(times) {
    let _this = this;
    let timer = _this.data.timer;
    timer = setInterval(function() {
      times--
      let time = main.countDown(times, 0)
      _this.setData({
        times: time
      })
      if (times <= 0) {
        clearInterval(timer);
        _this.times();
      }
    }, 1000);
    _this.setData({
      timer: timer
    })
  },
  collageList() {
    util.http('home/group_recommend', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          collageList: res.data
        })
      }
    })
  },
  toSecKill(e) {
    wx.navigateTo({
      url: '../secKill/secKill'
    })
    let formId = e.detail.formId;
    main.collectFormIds(formId);
  },
  toStore(e) {
    main.toDetails(e, "store")
  },
  listPage(e) { //折扣商品
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../listPage/listPage?id=' + id + '&type=' + type + '&name=' + name
    })
    let formId = e.detail.formId;
    main.collectFormIds(formId);
  },
  bindsubmit(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone
    })
    this.plus()
  },
  consumer(e) {
    this.setData({
      isConsumer: 1
    })
    wx.navigateTo({
      url: '../consumer/consumer?currentId=3'
    })
  },
  cate() {
    util.http('home/cate', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          cate: res.data
        })
      }
    })
  },
  storeList() {
    util.http('home/store_recommend', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          storeList: res.data
        })
      }
    })
  },
  goTop() { //回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 获取滚动条当前位置 
  onPageScroll(e) {
    if (e.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onHide() {
    clearInterval(this.data.timer);
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
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init()
    this.times();
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})