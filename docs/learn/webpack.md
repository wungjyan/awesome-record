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
```bash
module.exports = {
  mode: 'development'
};
```
或者在命令参数中传递：
```bash
webpack --mode=development
```
## Loader
webpack 默认只识别以 js 结尾的文件，当遇到其他格式的文件后，webpack 不知道该如何去处理，此时，就需要用到 Loader 将资源转化，使其可以被加载。

`Loader` 本质上就是一个函数，在该函数内对接收到的内容进行转换，返回转换后的结果，相当于一个翻译官。

`Loader` 在module.rules 中配置。

### 处理图片的loader
处理图片文件的 loader 主要有 [file-loader](https://www.webpackjs.com/loaders/file-loader/) 和 [url-loader](https://www.webpackjs.com/loaders/url-loader/)。它们都可以将图片打包到文件夹中，不同的是 `url-loader` 可以设置文件大小阀值限制，当打包的图片小于阀值时，直接返回 base64 格式的图片地址。

### 处理样式的loader
处理css样式一般需要同时使用两个loader，分别是 `css-loader` 和 `style-loader`，使用如下：
```json
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
```json
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

