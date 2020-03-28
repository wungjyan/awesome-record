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