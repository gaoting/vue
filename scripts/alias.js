// 导出路径常量
const path = require('path')

// 把模块解析成绝对路径
const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'), // vue运行入口
  compiler: resolve('src/compiler'), // 模板编译成渲染函数
  core: resolve('src/core'), // vue核心，响应式、虚拟DOM、组件等
  shared: resolve('src/shared'), // 共用工具函数、常量等
  web: resolve('src/platforms/web'), // 浏览器中运行的代码
  server: resolve('packages/server-renderer/src'), // 服务端渲染的代码
  sfc: resolve('packages/compiler-sfc/src') // 单文件组件编译器代码，将组件编译成js对象
}
