<template>
  <div class="login-container">
    <a-card class="login-card" title="系统登录" :bordered="false">
      <a-form
        name="login"
        :model="form"
        @submit.prevent="handleSubmit"
        style="max-width: 300px;"
      >
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="form.username" placeholder="用户名" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="form.password" placeholder="密码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" block>登录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Card, Form, Input, InputPassword, Button } from 'ant-design-vue'

// 注册组件
const aCard = Card
const aForm = Form
const aFormItem = Form.Item
const aInput = Input
const aInputPassword = InputPassword
const aButton = Button

const router = useRouter()
const form = reactive({
  username: 'admin',
  password: '123456'
})

const handleSubmit = () => {
  // 这里模拟登录，你可以调用接口验证
  if (form.username === 'admin' && form.password === '123456') {
    localStorage.setItem('token', 'fake-token') // 模拟token
    router.push('/') // 登录成功跳转首页
  } else {
    alert('用户名或密码错误')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.login-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 30px;
  background-color: white;
}

.login-card .ant-form-item {
  margin-bottom: 20px;
}

.login-card .ant-btn-primary {
  background-color: #1890ff;
  border-color: #1890ff;
  transition: all 0.3s;
}

.login-card .ant-btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
}
</style>