const utils = require('./utils')
module.exports = {
    title: 'awesome-record',
    description: '个人记录',
    base: '/awesome-record/',
    themeConfig: {
        nav:[
            {
                text:'首页',
                link:'/'
            }
        ],
        sidebar: utils.inferSiderbars(),
        lastUpdated:'上次更新'
    }
}