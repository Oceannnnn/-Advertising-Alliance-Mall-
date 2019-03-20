// pages/menu/menu.js
Page({

    /**
     * 页面的初始数据
     * menuListPage：每页显示数量
     * menuListData：菜单数据
     */
    data: {
        menuListPage: 10,
        menuListData: []
    },

    /**
     * 按一定长度拆分数组
     */
    splitArr: function(menuListPage, arr) {
        var groupNum = Math.ceil(arr.length / menuListPage);
        var newArr = [];
        for (var i = 0; i < groupNum; i++) {
            newArr[i] = arr.slice(menuListPage * i, menuListPage * (i + 1));
        }
        return newArr;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var data = [{
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }, {
            id: 19,
            title: "菜单",
            img: "/images/my.jpg"
        }]
        var menuListData = this.splitArr(this.data.menuListPage, data);
        this.setData({
            menuListData: menuListData
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})