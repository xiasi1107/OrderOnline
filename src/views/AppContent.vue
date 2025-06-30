<template>
  <a-layout style="min-height: 100vh">
      <!--顶栏-->
      <a-layout-header style="background: #7373f6; padding: 0; display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin-left: 3%;">MIEA</h1>
        <a-space style="display: flex; align-items: center; gap: 10px; margin-right: 3%;">
          <a-select
          ref="select"
          v-model:value="shopstate"
          style="width: 100px"
          @focus="focus"
          @change="handleChange"
          >
            <a-select-option value="营业中">营业中</a-select-option>
            <a-select-option value="打烊">打烊</a-select-option>
          </a-select>
          <a-button type="primary" shape="circle" style="float: right;" @click="logout">退出</a-button>
        </a-space>
      </a-layout-header>
    <a-layout>
            <!--侧边栏-->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <!--菜单组件-->
      <a-menu 
      v-model:selectedKeys="selectedKeys" 
      v-model:openKeys="openKeys"
      theme="dark" 
      mode="inline">
        <a-menu-item key="1">
          <router-link to="/"></router-link>
          <HomeOutlined />
          <span>我的店铺</span>
        </a-menu-item>

        <a-menu-item key="2">
          <router-link to="/order-management">
            <ContainerOutlined />
            <span>订单管理</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="3">
          <router-link to="/dish">
            <file-outlined />
            <span>菜品管理</span>
          </router-link>
        </a-menu-item>

        <!-- 新增菜单项 -->
        <a-menu-item key="4">
          <router-link to="/employee">
            <TeamOutlined />
            <span>员工管理</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="5">
          <router-link to="/package">
            <GiftOutlined />
            <span>套餐管理</span>
          </router-link>
        </a-menu-item>

        <a-menu-item key="6">
          <router-link to="/statistics">
            <BarChartOutlined />
            <span>数据统计</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>


    <a-layout direction="vertical">
      <a-layout-content style="margin: 16px 16px;">
        <!-- <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          Bill is a cat.
        </div> -->
        <router-view></router-view>
      </a-layout-content>

      </a-layout>

    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  FileOutlined,
  ContainerOutlined,
  HomeOutlined,
  TeamOutlined,
  GiftOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue';


// 侧边栏折叠状态
const collapsed = ref(false);

// 菜单选中项
// 初始化：读取本地存储或设置默认值
const selectedKeys = ref<string[]>(
  JSON.parse(localStorage.getItem('selectedKeys') || '["1"]')
);

// 监听选中状态变化，更新本地存储
watch(selectedKeys, (newValue) => {
  localStorage.setItem('selectedKeys', JSON.stringify(newValue));
}, { deep: true });


// 可选：处理其他状态（如 shopstate）
const shopstate = ref('打烊');

import { useRouter } from 'vue-router'

const router = useRouter();

// 退出
const logout = () => {
  // 清理 token
  localStorage.removeItem('token');
  // 也可以清理其他用户信息、状态等
  // 清理菜单选中状态
  localStorage.removeItem('selectedKeys');
  // 跳转回登录页
  router.replace('/login');
}

// 
const handleChange = (value: string) => {
  shopstate.value = value
  console.log('shopstate 改为：', value)
}

const focus = () => {
  // 可在此拉取最新状态或做联动
  console.log('shopstate 下拉框获取焦点')
}


</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
