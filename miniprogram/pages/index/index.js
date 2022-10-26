const util = require('../../utils/util.js')

Page({
    data: {
        time_start: true,
        cateActive: 0,
        absorbTime: 1,

        rate: "",
        clockHeight: 0,
        time: '5',
        mtime: 0,
        timeStr: '05:00',
        timer: null,
        okShow: false,
        pauseShow: true,
        continueShow: false,

        taskArr: [{
                icon: "gongzuo.png",
                text: "工作",
            },
            {
                icon: "xuexi.png",
                text: "学习",
            },
            {
                icon: "xiezuo.png",
                text: "写作",
            },
            {
                icon: "yuedu.png",
                text: "阅读",
            },
            {
                icon: "yule.png",
                text: "娱乐",
            }
        ]
    },


    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        })
    },
    onLoad() {
        var res = wx.getSystemInfoSync();
        var rate = 750 / res.windowWidth;
        this.setData({
            rate: rate,
            clockHeight: rate * res.windowHeight,
        })
    },
    // 页面周期结束，关闭这个定时器
    onUnload() {
        clearInterval(this.data.timer);
    },
    slider1change(e) {
        // this.drawtime()
        this.setData({
            absorbTime: e.detail.value
        })
        console.log(this);
    },
    start() {
        this.setData({
            time_start: false,
            mtime: this.data.absorbTime * 60 * 1000,
            timeStr: parseInt(this.data.absorbTime) >= 10 ? this.data.absorbTime + ':00' : '0' + this.data.absorbTime + ':00'
        })
        this.drawBg();
        this.continue()
    },

    clickCate(e) {
        this.setData({
            cateActive: e.currentTarget.dataset.index
        })

    },

    // 底下的圆环
    drawBg() {
        const lineWidth = 6 / this.data.rate; //px
        const query = wx.createSelectorQuery()
        query.select('#progress_start')
            .fields({ node: true, size: true })
            .exec((res) => {
                const canvas = res[0].node
                const ctx = canvas.getContext('2d')
                const dpr = wx.getSystemInfoSync().pixelRatio
                canvas.width = res[0].width * dpr
                canvas.height = res[0].height * dpr
                ctx.scale(dpr, dpr)
                ctx.lineCap = 'round'
                ctx.lineWidth = 'lineWidth'
                ctx.beginPath()
                ctx.arc(400 / this.data.rate / 2,
                    400 / this.data.rate / 2,
                    400 / this.data.rate / 2 - 2 * lineWidth,
                    0, 2 * Math.PI, false)
                ctx.strokeStyle = "#000000"
                ctx.stroke()
            })
    },


    // 动态时间画圆
    drawtime() {
        var _this = this;
        var timer = this.data.timer;
        timer = setInterval(() => {
            const lineWidth = 6 / _this.data.rate; //px
            var time = _this.data.absorbTime * 60 * 1000
            var mtime = _this.data.mtime - 100
            _this.setData({ mtime: mtime })
            var angle = 1.5 + 2 * (time - mtime) / time
            var windRate = _this.data.rate;
            if (angle < 3.5) {
                if (mtime % 1000 == 0) {
                    var timeStr1 = mtime / 1000 //s
                    var timeStr2 = parseInt(timeStr1 / 60) //m
                    timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2
                    var timeStr3 = timeStr1 - timeStr2 * 60
                    timeStr3 = timeStr3 >= 10 ? timeStr3 : '0' + timeStr3
                    _this.setData({
                        timeStr: timeStr2 + ':' + timeStr3
                    })
                }
                const query = wx.createSelectorQuery()
                query.select('#progress_time')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node
                        const ctx = canvas.getContext('2d')
                        const dpr = wx.getSystemInfoSync().pixelRatio
                        canvas.width = res[0].width * dpr
                        canvas.height = res[0].height * dpr
                        ctx.scale(dpr, dpr)
                        ctx.lineCap = 'round'
                        ctx.lineWidth = "lineWidth"
                        ctx.beginPath()
                        ctx.arc(400 / windRate / 2,
                            400 / windRate / 2,
                            400 / windRate / 2 - 2 * lineWidth,
                            1.5 * Math.PI,
                            angle * Math.PI,
                            false)
                        ctx.strokeStyle = "#ffffff"
                        ctx.stroke()
                    })
            } else {
                var logs = wx.getStorageSync('logs') || []
                logs.unshift({
                    data: util.formatTime(new Date),
                    cate: _this.data.cateActive,
                    time: _this.data.absorbTime + '分钟',
                })
                wx.setStorageSync('logs', logs)
                _this.setData({ timeStr: '00:00' })
                _this.ok()
            }
        }, 100)
        _this.setData({
            timer: timer
        })
    },

    pause() {
        clearInterval(this.data.timer)
        this.setData({
            okShow: false,
            pauseShow: false,
            continueShow: true,
        })
    },
    continue () {
        this.drawtime()
        this.setData({
            okShow: false,
            pauseShow: true,
            continueShow: false,
        })
    },
    ok() {
        clearInterval(this.data.timer)
        this.setData({
            okShow: true,
            pauseShow: false,
            continueShow: false,
        })
    },
    cancle() {
        clearInterval(this.data.timer)
        this.setData({
            time_start: true
        })
    }
})