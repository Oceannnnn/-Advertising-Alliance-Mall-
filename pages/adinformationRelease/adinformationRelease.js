// pages/serviceType/serviceType.js
const app = getApp();
const util = require('../../utils/util.js');
const main = require('../../utils/main.js');
Page({
  data: {},
  onLoad(op) {
    main.uploadFormIds();
    this.setData({
      imgbox: [],
      image: {},
      st_content:'',
      id: op.id //id:1 图文/2为文章
    })
    util.http('article/cate', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          cate: res.data
        })
      }
    })
  },
  bindCate(e) {
    let indexCate = e.detail.value;
    let cate = this.data.cate;
    let cate_id = cate[indexCate].id;
    this.setData({
      indexCate: indexCate,
      cate_id: cate_id
    })
  },
  location() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          st_address: res.address
        })
      }
    })
  },
  bindMobile(e) {
    this.setData({
      st_mobile: e.detail.value
    })
  },
  bindContent(e) {
    this.setData({
      st_content: e.detail.value
    })
  },
  bindTitle(e) {
    this.setData({
      st_title: e.detail.value
    })
  },
  delImage(e) {
    let formId = e.detail.formId;
    main.collectFormIds(formId);
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1);
    this.setData({
      imgbox: imgbox
    });
  },
  upload(e) {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePat
        let tempFilePaths = res.tempFilePaths;
        that.uploadimg(tempFilePaths);
      }
    })
  },
  uploadimg(arr) {
    let token = "cc788938d95430640309504f78769e80";
    let box = [];
    let imgbox = this.data.imgbox
    box = imgbox;
    if (box == '') {
      box = []
    }
    let image = this.data.image;
    for (var i = 0; i < arr.length; i++) {
      var that = this;
      wx.uploadFile({
        url: util.u + "article/uploads",
        filePath: arr[i],
        name: 'file[]', //这里根据自己的实际情况改,
        formData: {},
        header: {
          "Content-Type": "multipart/form-data",
          token: token
        }, //这里是上传图片时一起上传的数据
        complete: (res) => {
          i++; //这个图片执行完上传后，开始上传下一张
          let data = res.data;
          data = JSON.parse(data);
          let url = data.data;
          image['image'] = url;
          box.push(image);
          image = {}
          that.setData({
            imgbox: box
          });
          if (i >= arr.length) { //当图片传完时，停止调用    
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            })
            return
          } else { //若图片还没有传完，则继续调用函数
            that.uploadimg(arr);
          }
        }
      });
    }
  },
  bindtap() {
    var indexCate = this.data.indexCate,
      id = this.data.id,
      st_address = this.data.st_address,
      st_title = this.data.st_title,
      st_content = this.data.st_content,
      st_mobile = this.data.st_mobile,
      imgbox = this.data.imgbox;
    if (!st_title) {
      wx.showToast({
        title: '请输入要发布的内容',
        icon: 'none'
      })
      return
    }
    if (id == 1) { //图文
      if (imgbox == '') {
        wx.showToast({
          title: '请上传图片',
          icon: 'none'
        })
        return
      }
    } else {
      if (st_content=='') {
        wx.showToast({
          title: '请输入文章',
          icon: 'none'
        })
        return
      }
    }
    if (!st_address) {
      wx.showToast({
        title: '请输入地址',
        icon: 'none'
      })
      return
    }
    if (!st_mobile) {
      wx.showToast({
        title: '请输入联系方式',
        icon: 'none'
      })
      return
    }
    if (!indexCate) {
      wx.showToast({
        title: '请选择分类',
        icon: 'none'
      })
      return
    }
    let cate_id = this.data.cate_id;
    imgbox = JSON.stringify(imgbox)
    let token = app.globalData.token;
    let st_id = this.data.st_id;
    let json = {
      address: st_address,
      content: st_content,
      imgbox: imgbox,
      phone: st_mobile,
      cate_id: cate_id,
      title: st_title,
      type:id
    }
    util.http("article/add", json , 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../Advertisement/Advertisement',
          })
        }, 500)
      }
    })
  }
})