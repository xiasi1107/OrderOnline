
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 去掉路径中的 `/api`
        }
        // secure: false, // 如果是https接口，需要配置这个参数
        // ws: true, // 如果要代理websocket
      }
    }
  }
}
