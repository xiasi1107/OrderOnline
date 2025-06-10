<template>
  <a-form
    name="login"
    :model="form"
    @submit.prevent="handleSubmit"
    style="max-width: 300px; margin: 100px auto;"
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
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

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
