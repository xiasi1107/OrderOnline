import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 配置代理前缀，以/api开头的请求会被代理
      '/api': {
        target: 'http://localhost:8080', // 后端API地址
        changeOrigin: true, // 修改请求源
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，去除/api前缀
        // secure: false, // 如果是https接口，需要配置这个参数
        // ws: true, // 如果要代理websocket
      }
    }
  }
})