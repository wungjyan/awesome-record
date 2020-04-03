# webpack 4 记录
这里是 webpack4 的一些学习记录
## 安装与配置
推荐在每个项目内局部安装，这样各项目可以使用不同的版本。新建项目目录，然后执行：
```bash
npm init -y

npm install webpack webpack-cli -D
```
`webpack-cli` 必须同时安装，不安装的话没办法在命令行使用 `webpack` 命令。

安装完毕后，可以直接使用 `webpack` 命令打包，比如需要对 `index.js` 文件打包，可以执行：
```bash
npx webpack index.js
```
注意这里要使用 `npx`，因为是局部安装的 `webpack`。

在实际开发中，通常我们是用一个配置文件来指定打包相关配置的，配置文件的默认命名为 `webpack.config.js`，一份最简单的配置需要指定打包入口以及出口，比如这样：
```js
const path = require('path')
module.exports = {
    entry:'./index.js', // 指定打包入口文件
    output:{ 
        filename:'main.js',  // 指定打包出来的文件名
        path:path.resolve(__dirname,'dist') // 指定打包文件的输出路径
    }
}
```
有了配置文件后，此时直接运行 `npx webpack` 即可完成打包。

如果需要自定义配置文件的名称（有时候会编写多份配置文件，它们的名称不能同时为 webpack.config.js），那么在打包时我们要指定使用哪一个配置文件，使用指令 `--config`，比如：
```
npx webpack --config my.config.js // 根据配置文件 my.config.js 来打包
```
可以使用 `scripts` 命令来简化命令操作，在 `package.json` 文件中的 `scripts` 选项中配置：
```json
"scripts": {
    "bundle": "webpack --config my.config.js"
},
```
此时执行 `npm run bundle` 即可执行打包操作，这在命令行配置很多的情况下，极大简化了操作。一个细节就是配置中无需加入 `npx`，因为 `scripts` 中的命令会自动从当前项目中查找相关命令。
## 模式（mode）
webpack 提供 mode 配置选项，告知 webpack 使用相应模式的内置优化。如果不手动配置，默认是 `production` 模式，它会压缩打包后的代码。开发环境中可手动配置为 `development` 模式：
```js
module.exports = {
  mode: 'development'
};
```
或者在命令参数中传递：
```bash
webpack --mode=development
```

## 入口（entry）和出口（output）
entry 单个入口，可以是一个字符串路径，也可以是一个包含多个字符串路径的数组。

**单一字符串路径：**
```js
{
  entry: './src/index.js'  
}
```
等同于：
```js
{
    entry: {
        main: './src/index.js'
    }
}
```
此时如果 output.filename 没有指定输出文件名，那么默认就为 `main.js`，如果指定了输出名。以 output.filename 为准。

**数组路径：**
```js
{
    entry:['./src/index.js', './src/demo.js']
}
```
这种写法表示将多个文件打包到一个文件中，最终打包出的出口文件只有一个。

**对象语法：**
```js
{
    entry: {
        app: './src/app.js',
        vendors: './src/vendors.js'
    }
}
```
此种写法会打包出两个文件，所以在 output.filename 设置时不能设置为一个单一的出口文件，可以不设置，此时打包出的文件名就是 entry 中的 key 名。或者使用占位符写法：
```js
{
    output:{
        filename: '[name].js'
    }
}
```
此时打包出的就是 `app.js` 和 `vendors.js`


## SourceMap
什么是 SourceMap ?

sourceMap 就是一个文件，里面储存着位置信息。

打包后的代码与实际开发中的代码不一样，SourceMap 文件保存了打包前后代码的位置映射关系，这样在调试的时候能够找到源代码中出错的位置。

在 webpack 中启动 SourceMap，需要在 devtool 中设置：
```js
{
    devtool: 'source-map'
}
```
更多 devtool 的可配置值参考 [webpack 中文官网 devtool](https://www.webpackjs.com/configuration/devtool/)


## Loader
webpack 默认只识别以 js 结尾的文件，当遇到其他格式的文件后，webpack 不知道该如何去处理，此时，就需要用到 Loader 将资源转化，使其可以被加载。

`Loader` 本质上就是一个函数，在该函数内对接收到的内容进行转换，返回转换后的结果，相当于一个翻译官。

`Loader` 在module.rules 中配置。

### 处理图片的loader
处理图片文件的 loader 主要有 [file-loader](https://www.webpackjs.com/loaders/file-loader/) 和 [url-loader](https://www.webpackjs.com/loaders/url-loader/)。它们都可以将图片打包到文件夹中，不同的是 `url-loader` 可以设置文件大小阀值限制，当打包的图片小于阀值时，直接返回 base64 格式的图片地址。

### 处理样式的loader
处理css样式一般需要同时使用两个loader，分别是 `css-loader` 和 `style-loader`，使用如下：
```js
module:{
    rules:[
        {
            test: /\.css$/,
            use:['style-loader','css-loader']
        }
    ]
}
```
use 数组中的各个 loader，是从右向左依次应用的。`css-loader` 作用是解析 .css 结尾的文件，而 `style-loader` 作用是将解析好的 css 样式挂载到页面上，所以顺序不能乱。

如果需要使用 sass 来编写样式，那就需要使用到 `sass-loader`，其配置如下：
```js
module:{
    rules:[
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }
    ]
}
```
`sass-loader` 将 sass/scss 样式文件解析为正常格式的 css 文件，然后再继续上面说的过程。注意安装时要同时安装 `sass-loader` 和 `node-sass`：
```bash
npm install sass-loader node-sass --save-dev
```

### 更多的loader
更多的 loader 可以参考 [中文官网loaders](https://www.webpackjs.com/loaders/)，里面有很多详细的配置。

## 插件（Plugin）
插件用以扩展 webpack 的功能，在 webpack 运行的过程中，插件会监听一些事件，在合适的时机通过 webpack 提供的 api 改变输出结果。

插件在 plugins 中单独配置，类型为数组，每一项是一个插件的实例，参数通过构造函数传入。

演示 `html-webpack-plugin` 和 `clean-webpack-plugin` 两个常用插件的使用：
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    // ... 
    plugins:[
        new HtmlWebpackPlugin({
           template:'./src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
}
```
更多插件可参考 [中文官网 Plugins](https://www.webpackjs.com/plugins/)

## devServer
开发环境搭建服务器环境，可以配置 devServer。如下：
```js
{
    devServer:{
        contentBase: path.join(__dirname,'dist') // 在打包目录中启动服务
        compress: true, // 启用 gzip 服务
        open: true, // 自动打开浏览器
        port: 9000 // 端口
    }
}
```
此时在 scripts 命令中配置：
```js
scripts:{
    "start": "webpack-dev-server"
}
```
当运行 `npm run start` 时，页面会被自动打开，同时当修改代码保存时，会自动刷新浏览器以达到实时预览效果。

更多配置参考 [devServer](https://www.webpackjs.com/configuration/dev-server/)

## 热替换
什么是热替换？

上面说到当启用 devServer 配置后，改变源代码时浏览器会自动刷新以实现实时预览。
但有时我们并不想整个页面都被刷新，比如页面中的有些模块可能是后来才加载出来的，在改变源代码时我们不想这些模块因为页面刷新而消失，同时改变的效果也能实时预览。此时就需要热替换的功能，在不刷新页面的情况下做到实时预览。

在 `devServer` 中配置热替换功能：
```js
{
    devServer:{
        hot: true, // 开启热替换
        hotOnly: true // 非必须开启，开启此项后表示即使热替换构建失败，也不要刷新页面作为回退
    }
}
```
然后在插件配置中追加 `webpack.HotModuleReplacementPlugin`，如下：
```js
 plugins:[
        new HtmlWebpackPlugin({
           template:'./src/index.html'
        }),
        new CleanWebpackPlugin(),

        new webpack.HotModuleReplacementPlugin()  // 添加此插件
    ]
```
这样热替换功能就开启了。

## 配置 Babel
配置 Babel 以转义 es6 语法，需要安装以下三个插件：
```bash
npm install --save-dev babel-loader @babel/core @babel/preset-env
```
然后配置如下：
```js
{
    test:/\.js$/,
    exclude:/node_modules/,
    loader:'babel-loader',
    options:{
        presets:['@babel/preset-env']
    }
}
```
此时就可以对 es6 语法转义，但是仍然有一些语法不会被转义，比如 Promise 变量等，这些在低版本浏览器中是不会被支持的，所以此时需要一个更彻底的转义支持，这就要用到 polyfill 了。

安装 polyfill 插件：
```bash
npm install --save @babel/polyfill
```
然后在主入口文件中引入即可：
```js
import '@babel/polyfill'
```
现在又有一个问题，引入 polyfill 后，打包时也会将这部分代码一并打包，这就导致生成的文件很大。如果需要转义的语法并不多，那么全引入 polyfill 反而不划算，此时需要按需引入，方法是在 options 中加一个 useBuiltIns 的配置：
```js
{
    test:/\.js$/,
    exclude:/node_modules/,
    loader:'babel-loader',
    options:{
        presets:[['@babel/preset-env',{
            useBuiltIns: 'usage'
        }]]
    }
}
```
现在再去打包，可能就会发现打包后的文件体积有所改善，这取决于你的实际代码应用了多少新特性。

除了 `useBuiltIns` 这个配置，我们还可以加一个 `targets` 的配置项，如：
```js
options:{
    presets:[['@babel/preset-env',{
        targets:{
            chrome:"67"
        },
        useBuiltIns: 'usage'
    }]]
}
```
这个配置的意思是，打包后的文件是运行在 chrome 浏览器 67 版本上的，此时打包的时候，会自动判断哪些语法需要用更多的代码去转义，如果浏览器已经支持的语法，则不会转义。此时如果配置的浏览器版本很新，那么打包文件的体积也会相应减小不少，相反如果配置的浏览器版本很低，那么就需要进行更多的代码转义，增加打包文件的体积。

### plugin-transform-runtime
以上是 presets 相关的配置，这在写业务代码时是可以使用的，但是在编写一些插件或者库之类的项目时，就不太适用了，因为 `polyfill` 会将 Promise 等添加成全局变量，会污染全局空间。此时我们需要用另外一种方法来转义代码，首先安装两个插件：
```bash
npm install --save-dev @babel/plugin-transform-runtime @babel/runtime
```
然后修改 options 配置，去掉 `presets` 的配置，整个配置如下：
```js
{
    test:/\.js$/,
    exclude:/node_modules/,
    loader:'babel-loader',
    options:{
        // presets:[['@babel/preset-env',{
        //     targets:{
        //         chrome:"67"
        //     },
        //     useBuiltIns: 'usage'
        // }]]
        
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                "corejs": 2,
                "helpers": true,
                "regenerator": true,
                "useESModules": false
                }
            ]
        ]
    }
}
```
对了还需要安装一个插件：
```bash
npm install --save @babel/runtime-corejs2
```
这个插件对应配置中的 `"corejs": 2`

最后的最后，我们还要删除 polyfill 的引用，然后就可以正常打包了。