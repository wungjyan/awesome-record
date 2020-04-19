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
            },
            {
                text: '算法',
                link: '/algorithm/chapter1'
            },
            {
                text: 'Blog',
                link: '/blog/vue'
            }
        ],
        sidebar: utils.inferSiderbars(),
        repo:'wungjyan/awesome-record',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated:'上次更新'
    }
}