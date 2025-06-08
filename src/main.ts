import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'; // antd注册配置
import 'ant-design-vue/dist/reset.css'

createApp(App).use(store).use(router).use(Antd).mount('#app')
