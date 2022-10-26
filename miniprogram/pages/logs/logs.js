// logs.ts
const util = require('../../utils/util.js')

Page({
    data: {
        logs: [],
        dayList: [],
        list: [],
        sum: [{
            title: '今日番茄次数',
            val: 0
        }, {
            title: '今日番茄时间',
            val: 0
        }, {
            title: '历史番茄次数',
            val: 0
        }, {
            title: '历史番茄时间',
            val: 0
        }, ],
        activeIndex: 1,
        taskArr: ["工作", "学习", "写作", "阅读", "娱乐", ]
    },
    onShow() {
        var logs = wx.getStorageSync('logs') || []
        console.log(logs, 'ilogs')
        var day = 0;
        var total = logs.length;
        var dayTime = 0;
        var totalTime = 0;
        var dayList = []
        if (logs.length > 0) {
            logs.map(item => {
                if (item.data.substr(0, 10) == util.formatTime(new Date).substr(0, 10)) {
                    day = day + 1;
                    dayTime = dayTime + parseInt(item.time)
                    dayList.push(item)
                }
                totalTime = totalTime + parseInt(item.time)
            })
            this.setData({
                logs: logs,
                dayList: dayList,
                'sum[0].val': day,
                'sum[1].val': dayTime,
                'sum[2].val': total,
                'sum[3].val': totalTime,
            })
        }
        this.getAlltime()
    },
    // 选择查看今日或者历史记录
    changeType(e) {
        var list = [];
        var activeIndex = e.target.dataset.index
        if (activeIndex == 0)
            list = this.data.dayList
        else list = this.data.logs

        this.setData({
            list: list,
            activeIndex: activeIndex
        })
    },

    getAlltime() {
        var list = this.data.logs
        this.setData({
            list: list,
        })
    }
})