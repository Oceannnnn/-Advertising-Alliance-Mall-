// pages/adStore/adStore.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {
    dynamicList: []
  },
  onLoad(op) {
    main.uploadFormIds();
    this.init()
    if (op.id) {
      this.dynamicList("", 1, op.id)
      this.setData({
        cate_id: op.id
      })
    }
    if (op.st_id){
      this.setData({
        st_id: op.st_id
      })
      this.list(1, op.st_id)
    }
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
  },
  list(page, st_id) {
    let json = {
      size: 10,
      page: page,
      st_id: st_id
    }
    let list = this.data.dynamicList;
    let token = app.globalData.token;
    util.http('ad/store_article', json, 'post', token).then(res => {
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
  dynamicList(type, page, cate_id) {
    let json = {
      type: type,
      size: 10,
      page: page,
      cate_id: cate_id
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
      if (this.data.cate_id) {
        this.dynamicList(this.data.type, this.data.page, this.data.cate_id)
      } else {
        this.list(this.data.page, this.data.st_id)
      }
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
    this.dynamicList(type, 1, this.data.cate_id)
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
    })
  },
  adMold() {
    if (app.globalData.state == 1) {
      wx.navigateTo({
        url: '../adMold/adMold?type=1'
      })
    } else {
      main.goLogin(1)
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
      }else{
        wx.showToast({
          title: '已点过赞',
          icon:'none'
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
      util.http('article/add_plun', { id: id, comment: comment }, 'post', token).then(res => {
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
})