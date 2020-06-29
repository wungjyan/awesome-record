# Webpack
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

如果需要自定义配置文件的名称（有时候会编写多份配置文件，它们的名称不能同时为 webpack.config.js），那么在打包时我们要指定使用哪一个配置文件，使用指令 `--config`，比如要根据配置文件 my.config.js 来打包：
```bash
npx webpack --config my.config.js 
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
`mode` 的两种方式的区别：
- `development`：会将 `process.env.NODE_ENV` 的值设为 `development`。同时启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。
- `production`：会将 `process.env.NODE_ENV` 的值设为 `production`。同时启用 `FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`

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

// 需要先安装 npm install --save-dev webpack-dev-server
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
        presets:[
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage'
                }
            ]
        ]
    }
}
```
现在再去打包，可能就会发现打包后的文件体积有所改善，这取决于你的实际代码应用了多少新特性。需要注意的是此时打包时可能会提示这样一段话：
> When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the `import '@babel/polyfill'` call or use `useBuiltIns: 'entry'` instead.

意思是当你设置了 `useBuiltIns: 'usage'`，webpack 会自动帮你引入 polyfill，所以我们可以在业务代码中移除 `import '@babel/polyfill'`。

除了 `useBuiltIns` 这个配置，我们还可以加一个 `targets` 的配置项，如：
```js
options:{
    presets:[
        [
            '@babel/preset-env',
            {
                targets:{
                    chrome:"67"
                },
                useBuiltIns: 'usage'
            }
        ]
    ]
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

**小技巧：**`options` 配置可以单独写到 `.babelrc` 文件中，项目目录中新建 `.babelrc` 文件，然后可以配置options，比如：
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "chrome": "67"
                },
                "corejs": 2, // 根据提示配置的此项  npm install --save core-js@2
                "useBuiltIns": "usage"
            }
        ]
    ]
}
```

## Tree Shaking
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)，它依赖于 ES2015 模块系统中的静态结构特性，例如 `import` 和 `export`，在 CommonJS 规范中不适用。

举个例子，写一个 `math.js` 文件，它包含两个方法函数：

`src/main.js`
```js
export const add = (a, b) => {
    return a + b
}

export const minus = (a, b) => {
    return a - b
}
```

现在在 `src/index.js` 中引用 `add` 方法：
```js
import { add } from './math'

add(1, 2)
```
此时执行打包，然后在打包文件中这样一段：
```js
/***/ "./src/math.js":
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/*! exports provided: add, minus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"minus\", function() { return minus; });\nconst add = (a, b) => {\n  return a + b;\n};\nconst minus = (a, b) => {\n  return a - b;\n};\n\n//# sourceURL=webpack:///./src/math.js?");

/***/ })
```
可以发现，虽然没有引用 `minus` 方法，但它依旧被打包进来了，而 Tree Shaking 的作用就是删除这些 “未引用代码”，它会自动识别没有被 export 的部分，然后删除这块代码，如上例中的 `minus` 部分就会被删除。

但实际中并没有这么简单，有时候导入的代码中并没有暴露 export，只在导入时执行一些特殊行为，比如 polyfill，它影响全局作用域，并且通常不提供 export。这时候我们就不能利用 Tree Shaking 去删除它的引用。所以首先我们要告诉 webpack，哪些是可以安全删除的，做法是在 package.json 中添加 `"sideEffects"` 属性：
```json
{
  "name": "your-project",
  "sideEffects": false
}
```
设置为 false，表示完全可以删除未用到的 export 导出。它也可以接收一个数组值，数组方式支持相关文件的相对路径、绝对路径和 glob 模式，如下：
```json
{
  "name": "your-project",
  "sideEffects": [
    "@babel/polyfill",
    "*.css"
  ]
}
```
数组中的文件都不会受 tree shaking 影响，不会因为没有 export 而被删除。

设置完 `"sideEffects"`还不行，我们需要去 webpack 的配置文件中添加一个 `optimization` 的配置：
```js
module.exports = {
  mode: "development",
  optimization: {
    usedExports: true
  }  

}
```
这个配置要在 `mode="development"` 下手动添加，当 mode 为 `production` 时会自动开启。

现在再去打包，结果可能不尽人意，会发现还是没有删除未引用的代码，因为在开发环境下，是不会删除这些代码的，只是开启 tree shaking 后，webpack 还是知道了哪些是用到的代码：
```js
/***/ "./src/math.js":
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/*! exports provided: add, minus */
/*! exports used: add */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
```
webpack 标注了 `exports used: add`。生产环境下，应该会生效，之所以说是应该，是因为可能会有别的原因导致不生效，之后遇到再来补充。

## 代码分割（上）
代码分割是什么意思？

当我们要引入一个很大的 js 文件时，它必然会耗时更久，所以为了让加载更快，我们可能会将这个文件拆成若干个小的 js 文件，然后用 `<script src='*'></script>` 并行加载，这就是代码分割的概念。可以看出代码分割并不是 webpack 中的概念，这里只是讲怎么利用 webpack 实现代码分割。

什么时候需要代码分割？

开发中，很多时候我们的项目中会引入第三方库，这些库代码几乎不会变动，但打包时还是会和业务代码打包到一起，导致打包文件体积会很大，而且浏览器每次要看到效果时都必须执行完整个打包后的 js 文件，这影响了性能也影响了效率。此时就需要代码分割，将代码拆分打包成多个文件，加载时会并行加载，且不变的代码会直接从缓存中读取，极大提升了页面性能。

举例，我们在项目中引入 `lodash` 这个第三方库：

**src/index.js**
```js
import _ from 'lodash'
console.log(_.join(['a','b','c'],'~'))
```
此时执行打包，你会发现即使我们的业务代码仅有短短两行，但是打包出的 `main.js` 文件已经超出 1mb 了，部分信息如下：
```bash
Hash: b9da9a28a34017da8c05
Version: webpack 4.42.1
Time: 966ms
Built at: 2020-04-09 10:15:38 AM
     Asset       Size  Chunks             Chunk Names
index.html  290 bytes          [emitted]  
   main.js   1.38 MiB    main  [emitted]  main
Entrypoint main = main.js
```
这时我们就需要使用代码分割功能，将 lodash 部分的代码单独打包。在 webpack 中实现代码分割最简单的方式就是配置多个入口，如下：
```js
{
    entry:{
        main: './src/index.js',
        lodash: './src/lodash.js'
    }
}
```
现在来创建 `src/lodash.js` 这个文件：
```js
import _ from 'lodash'
window._ = _
```
代码很简单，就是将 lodash 变量挂载到全局 window 变量上了，这样全局就能使用到它的方法了，同时我们需要将`index.js` 中的引入删除，如下：
```js
// ./src/index.js

console.log(_.join(['a','b','c'],'~'))
```

此时打包，结果：
```bash
Hash: 628c31b4969ab8f69bb0
Version: webpack 4.42.1
Time: 960ms
Built at: 2020-04-09 11:22:16 AM
     Asset       Size  Chunks             Chunk Names
index.html  323 bytes          [emitted]  
 lodash.js   1.38 MiB  lodash  [emitted]  lodash
   main.js   29.1 KiB    main  [emitted]  main
Entrypoint main = main.js
Entrypoint lodash = lodash.js
```
可以看到打包后，会将 `lodash` 库单独打包成 `lodash.js`文件，而 `main.js` 文件只包含业务代码，所以体积目前很小，在浏览器初始加载时会耗费一些时间，但是之后再加载时，由于 `lodash.js` 文件并未改变，所以会从缓存中读取，提升了页面性能。

**注意：此时打开 index.html 文件后会报错 `_ is not defined`，这是因为入口文件的书写顺序，影响了最终加载顺序，如果业务代码先加载，那么 _ 还未挂载到全局变量上，所以我们要修改 entry 的书写顺序，先引入 lodas，如下：**
```js
{
    entry: {
        lodash: './src/lodash.js',
        main: './src/index.js'
    }
}
```

## 代码分割（下）
在 entry 中配置多入口文件，看似操作简单，但问题也很明显，不够灵活，当项目中需要引入很多很杂的第三方库时，不好拆分，还要考虑多个入口中包含了重复的模块。

webpack 提供了拆分代码的配置项，先把代码还原一下，删除 `lodash.js` 文件，将 `index.js` 文件还原为：
```js
import _ from 'lodash'

console.log(_.join(['a','b','c'],'~'))
```
同时删除 entry 中的 lodash 入口，添加 `optimization` 配置，如下：
```js
module.exports = {
    // ...
    entry: {
        main: './src/index.js'
    },
    optimization: {
        // 配置代码分割
        splitChunks: {
            chunks: 'all'
        }
    }

}
```
此时打包，结果：
```bash
Hash: 41ec5a419f07db298838
Version: webpack 4.42.1
Time: 1052ms
Built at: 2020-04-09 3:02:02 PM
          Asset       Size        Chunks             Chunk Names
     index.html  329 bytes                [emitted]  
        main.js   32.3 KiB          main  [emitted]  main
vendors~main.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```
这样配置后，会将 `lodash` 库代码打包到 `vendors~main.js` 文件中，也实现了代码分离的效果。
其实 `splitChunks` 这个配置有很多配置项，当你不写任何配置时，它的完整默认配置如下：
```js
splitChunks: {
    chunks: 'async',
    minSize: 30000,
    minRemainingSize: 0,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: 4,
    automaticNameDelimiter: '~',
    cacheGroups: {
    defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
    },
    default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
    }
    }
}
```
各项配置的含义参考官方文档 [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)

前面例子中，`import _ from 'lodash'` 这样的引入方式属于同步引入方式，接下来尝试一下异步引入的方式。首先我们可以修改下 `optimization` 配置项，如下：
```js
optimization: {
    // 配置为空时，采用默认配置项
    // 配置项 chunks 默认值是 'async'，表示只分割异步代码，它的其他可选值是 'all'（所有） ， 'initial（同步）'
    splitChunks: {
        // chunks: 'all'
    }
}
```
然后修改 `index.js` 文件的内容：
```js
function getComponent(){
    return import('lodash').then(({default:_})=>{
        let element = document.createElement('div')
        element.innerHTML = _.join(['a','b','c'],'~')
        return element
    })
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```
这是一种异步加载的方式，此时打包，结果：
```bash
Hash: 6fe77bfa610015985bd2
Version: webpack 4.42.1
Time: 1086ms
Built at: 2020-04-10 11:16:23 AM
     Asset       Size  Chunks             Chunk Names
      0.js   1.36 MiB       0  [emitted]  
index.html  290 bytes          [emitted]  
   main.js   34.5 KiB    main  [emitted]  main
Entrypoint main = main.js
```
可以看到 `lodash` 库代码被打包到 `0.js` 这个文件中了，如果想要自定义这个名字，可以加入魔法注释，修改 `index.js`：
```
function getComponent(){
    return import(/* webpackChunkName: 'lodash'*/ 'lodash').then(({default:_})=>{
        let element = document.createElement('div')
        element.innerHTML = _.join(['a','b','c'],'~')
        return element
    })
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```
此时再打包：
```bash
Hash: 3cb0a825db61f34059f4
Version: webpack 4.42.1
Time: 661ms
Built at: 2020-04-10 11:26:11 AM
            Asset       Size          Chunks             Chunk Names
       index.html  290 bytes                  [emitted]  
          main.js   34.6 KiB            main  [emitted]  main
vendors~lodash.js   1.36 MiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint main = main.js
```
可以看到 `lodash` 库代码被打包到 `vendors~lodash.js` 文件中了。为什么名称前面会多一个 `vendors`？这是因为 `splitChunks`的默认配置里`cacheGroups`这个配置项影响了，如果不想要前缀，可以修改配置：
```js
splitChunks:{
    cacheGroups:{
        // 文档中是 defaultVendors，但是配置失效，所以改成 vendors
        vendors:false,
        default:false
    }
}
```
此时再打包：
```bash
Hash: 2199955797b36a6146a4
Version: webpack 4.42.1
Time: 644ms
Built at: 2020-04-10 11:38:12 AM
     Asset       Size  Chunks             Chunk Names
index.html  290 bytes          [emitted]  
 lodash.js   1.36 MiB  lodash  [emitted]  lodash
   main.js   34.6 KiB    main  [emitted]  main
Entrypoint main = main.js
```
如果这种异步引入的方式不生效，或者魔法注释不生效，可能是webpack版本问题，可以添加使用插件 [@babel/plugin-syntax-dynamic-import](https://www.babeljs.cn/docs/babel-plugin-syntax-dynamic-import)

## 打包小思考
前面说到 `splitChunks` 这个配置项中的 `chunks` 默认值是 `async`，也就是默认只分割异步代码。为什么默认要这样设置？其实可以理解为 webpack 希望你是以异步的方式去编写代码，同步代码分割虽然可以使得后续加载更快，但是首次加载的速度并没有得到很大的提升，要想首次加载页面时渲染更快，可以用一种按需加载的异步方式去编写你的代码，即初始化时不加载全部代码，在需要的时候再加载剩余代码。下面举个例子：

新建文件 `./src/click.js`：
```js
function handleClick(){
    let element = document.createElement('div')
    element.innerHTML = 'helllo world'
    document.body.appendChild(element)
}

export default handleClick
```
逻辑很简单，就是创建一个函数，当执行时在页面添加一个 div 标签。再修改 `./src/index.js` ：
```js
document.addEventListener('click',()=>{
    import('./click.js').then(({default:func})=>{
        func()
    })
})
```
这就是一个按需加载的例子，当初始化运行时，页面只加载 `index.js` 部分的代码，而 `click.js` 部分的代码只会在你点击页面时才加载，这样处理就会使得初始加载速度极大提升，特别是当业务代码量很大时。

按需加载是把双刃剑。有时候按需加载部分的代码逻辑较复杂，所以页面反应可能会不及时，影响了用户体验。所以此时我们要考虑另一种可行性的方案：

那就是，同样是按需加载，即在首次加载的时候只加载需要的部分，但是按需加载的部分不需要等用户去触发才加载，而是当浏览器空闲下来时就加载，这样等到用户去触发时，其实已经将这部分代码加载了，这样也就解决了反馈不及时的情况了。那么这种方案可实现吗？当然可以，不然说这么多屁话干嘛。

实现上面这种方案的方法就是加魔法注释，以上面例子来说，我们修改 `index.js` 文件：
```js
document.addEventListener('click',()=>{
    import(/* webpackPrefetch: true */ './click.js').then(({default:func})=>{
        func()
    })
})
```
使用 `webpackPrefetch: true` 这个注释即可开启这种加载方式。此时打包运行，在浏览器控制台的 Network 中即可发现刷新页面时，所有文件瞬间都被加载了，看起来跟同步加载一样，其实是因为代码量太小，所以加载很快速导致察觉不到，`click.js` 部分是在浏览器加载完需要部分的代码后才加载的。此时点击页面时也会发现 `click.js` 部分又被加载了一次，但是时间明显缩短很多，这是因为之前已经被加载到缓存中了。

## 分割 CSS 代码
分割 css 代码使用到插件 `mini-css-extract-plugin`，安装插件：
```bash
npm install --save-dev mini-css-extract-plugin
```

然后在配置文件中配置使用：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader']
            }
        ]
    }
}
```
创建 `style.css` 样式文件：
```css
body{
    background: red;
}
```
在 `index.js` 入口文件中引用：
```js
import './style.css'

console.log('hello world')
```
打包后即可输出 `main.css` 外部样式文件。

## shimming
webpack 可以识别 ES 模块语法、CommonJS 或 AMD 规范编写的模块。但是一些第三方库可能会引用一些全局依赖（例如 `jQuery` 中的 `$`。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 shimming 发挥作用的地方。

详细的 shimming 一些配置可以参考 [shimming](https://www.webpackjs.com/guides/shimming/)

## 环境变量
有时候需要在 webpack 配置文件中针对开发和生产环境做一些差异化，这时候需要一些环境变量来辅助完成。

在 webpack 命令行环境配置中，可以通过 `--env` 来设置自己需要的环境变量，这些设置的变量可以在配置文件中获取。然而，你必须对 webpack 配置进行一处修改。通常，`module.exports` 指向配置对象。要使用 `env` 变量，你必须将 `module.exports` 转换成一个函数：
```js
const config = {
    entry: {
        main: './src/index.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[hash].js'
    }
    // ...
}

module.exports = env => {
    // 这里可以针对获取到的环境变量来做一些配置
    console.log('获取环境变量：',env)
    return config
}
```
命令行中设置参数，如：
```bash
webpack --env.test=hello
```
这样设置后，配置文件中获取到的 `env` 为 `{ test: 'hello' }`。如果不对变量赋值，如 `--env.test` 这样，那么 test 的值就是 `true`。

## 怎么配置多页面
配置多入口，打包多页面，以两个入口文件为例，首先配置 `entry`：
```js
// ...
entry: {
    index: path.join(__dirname,'index.js'),
    other: path.join(__dirname,'other.js')
}
```
再配置 `output`：
```js
// ...
output:{
    filename: '[name].[contentHash:8].js'
    // ...
}
```
出口文件名不能一样，所以需要 `[name]`，而 `[contentHash:8]` 会根据文件是否改变来变化。最后还要配置多 html 的输出：
```js
// ...
plugins:[
    // ...
    new HtmlWebpackPlugin({
        template: path.join(yourPath, 'index.html'),
        filename: 'index.html',
        chunks: ['index'] // 只引用 index.js
    }),
    new HtmlWebpackPlugin({
        template: path.join(yourPath, 'other.html'),
        filename: 'other.html',
        chunks: ['other'] // 只引用 other.js
    })
]
```
## 抽离 css 文件
在开发环境下，css 代码是输入到 html 文件头部的，使用 `style-loader`，如：
```js
// ...
{
    test: /\.css$/,
    loader: ['style-loader', 'css-loader']
}
```
在生产环境，需要单独分离css文件，使用插件 `mini-css-extract-plugin`，它的配置如下：
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// ...
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader']
            }
        ]
    },
    plugins: [new MiniCssExtractPlugin({
        filename:'css/main.[contentPath:8].css'
    })]
}
```
线上代码应当需要压缩，可以配合两个插件：[terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin) 和 [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)，压缩配置如下：
```js
const TerserWebpackPlugin = require('terser-webpack-plugin') // 压缩js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css
// ...
optimization:{
    minimizer:[new TerserWebpackPlugin({}),new OptimizeCssAssetsWebpackPlugin({})]
}
```
这里之所以加上 js 的压缩配置，是因为在不设置 `optimization.minimizer` 时，生产环境的 js 会默认压缩，但是主动配置压缩时，默认的压缩会被终止，所以也需要主动加上 js 的压缩。

## 抽离第三方代码和公共代码
本节可以参考 [代码分割（上）](#代码分割（上）)，这里补充一个配置：
```js
{
    // ...
    optimization:{
        // ...
        splitChunks:{
            chunks:'all',
            cacheGroups:{
                // 第三方模块
                vendor:{
                    name:'vendor', // chunk 名称
                    priority:1, // 优先级，权限更高，优先抽离
                    test:/node_modules/,
                    minSize:0, // 小于这个大小限定的不抽离，直接引入
                    minChunks:1 // 最少被引用几次才抽离
                },
                // 公共模块
                common:{
                    name:'common',
                    priority:0,
                    minSize:0,
                    minChunks:1
                }
            }
        }
    }
}
```

## module、chunk 和 bundle的区别
- module：各个源码文件，webpack 中一切皆模块
- chunk：多模块合并成的，如 `entry`、`import()` 和 `splitChunk` 
- bundle：最终的输出文件

## webpack 优化构建速度
### 优化 babel-loader
```js
{
    test: /\.js$/,
    use: ['babel-loader?cacheDirectory'], // 开启缓存
    include: path.resolve(__dirname,'src'), // 明确范围
    // 排除范围，include 和 exclude 两者选一个即可
    // exclude: path.resolve(__dirname, 'node_modules')
}
```

### happypack 多进程打包
js 是单线程，开启多进程打包，提高构建速度（特别是多核CPU）。

安装插件：
```bash
npm install happypack -D
```
`happypack`的配置可以在开发环境，也可以在生产环境。

配置loader，这里以打包 `.js` 文件为例：
```js
// ...
{
    test: /\.js$/,
    exclude:/node_modules/,
    use:['happypack/loader?id=babel'] // 这里使用固定的 happypack 用法
}
```

还要配置插件：
```js
// conts HappyPack = require('happypack')

new HappyPack({
    id: 'babel',
    // loaders:['babel-loader'] // 基本配置
    // 也可以配置 options，如下
    loaders:[
        {
            loader:'babel-loader',
            options:{
                presets:[
                    ['@babel/preset-env',{useBuiltIns:'usage'}
                ]
            }
        }
    ]
})
```

### ParallelUglifyPlugin 多进程压缩 JS
- webpack 内置 Uglify 工具压缩 JS，但不支持多进程
- JS 单线程，使用这个工具开启多进程压缩
- 和 happypack 同理

安装：
```bash
npm install webpack-parallel-uglify-plugin -D
```
插件使用：
```js
{
    // const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
    // ...
    plugins:[
        // 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // 还是使用 UglifyJS 压缩，只不过帮助开启了多进程
            UglifyJS: {
                output: {
                    beautify: false, // 是否最紧凑的输出
                    comments: false // 删除所有的注释
                },
                compress:{
                    // 删除所有的 `console` 语句，可以兼容 ie 浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            }
        })
    ]
}
```
注意这个插件应该使用在生产环境的打包。

#### 关于开启多进程
- 项目较大，打包较慢，开启多进程能提高速度
- 项目较小，打包很快，开启多进程会降低速度（进程开销）
- 按需使用

## 自动刷新与热更新
一般开发环境下，使用 `webpack-dev-server` 时会自动开启自动刷新，无需再配置。而热更新需要再配置，热更新与自动刷新的区别：
- 自动刷新，整个网页全部刷新，速度较慢，状态会丢失
- 热更新，新代码生效，网页不刷新，状态不丢失

webpack 开启热更新可以参考 [热替换](#热替换) ，本节补充一个知识点，即有时我们需要自己手动去对一些模块开启热更新，这里有一个例子：

工具库模块：
```js
// util.js
export function sum(a,b){
    return a + b
}
```
入口文件：
```js
// index.js

import {sum} from './util'
console.log(sum(10,50)) // 修改这里时，无法热更新


// 手动监听需要热更新的模块，这里接收 util.js 文件，当修改 util.js 文件时，会触发热更新回调
if(module.hot){
    module.hot.accept(['./util.js'],() => {
        console.log(sum(10,40))
    })
}
```

## DllPlugin 动态链接库插件
在开发环境中，每次构建都需要打包引入的第三方模块，如果不打包这些模块，那么构建速度将大大提升，这正是 DllPlugin 要做到的事。

webpack 内置了 DllPlugin 支持，使用 DllPlugin 插件打包出 dll 文件，使用 DllReferencePlugin 插件使用 dll 文件。

这里以打包 `lodash` 这个第三方模块为例。首先编写一个 webpack 配置文件用以打包 `lodash` 模块：
```js
// webpack.dll.js

const webpack = require('webpack')
const path = require('path')
module.exports = {
    mode:'development',
    entry:{
        lodash:['lodash']
    },
    output:{
        // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
        // 在这里 name 指的就是 lodash
        filename:'[name].dll.js',
        // 输出的文件放到这个目录下
        path:path.join(__dirname,'public'),
        // 存放动态链接库的全局变量名称。这里就是 _dll_lodash
        library:'_dll_[name]'
    },
    plugins:[
        new webpack.DllPlugin({
            // 该字段的值需要和 output.library 中保持一致
            // 该字段的值也就是输出的 manifest.json 文件中的 name 字段的值
            name:'_dll_[name]',
            // 描述动态链接库的 manifest.json 文件输出时的文件名称
            path:path.join(__dirname,'public/[name].manifest.json')
        })
    ]
}
```
然后可以在 `package.json` 的 `scripts` 中写入一个命令：
```json
scripts:{
    "dll": "webpack --config webpack.dll.js"
}
```
此时执行 `npm run dll` 即可打包出 `lodash` 的 dll 文件。

接下来还有两个重要步骤，一个是要在模板文件中手动引入刚打包出来的文件：
```html
<body>
    <script src="../public//lodash.dll.js"></script>
</body>
```
然后在开发环境的配置文件中使用 `DllReferencePlugin` 插件：
```js
// webpack.dev.js

// ...
plugins:[
    // ...
    new webpack.DllReferencePlugin({
        manifest:require('./public/lodash.manifest.json')
    })
]
```
重新执行 `npm run dev` 启动服务时，就不会再打包 `lodash` 模块了。



