<template>
  <a-card title="我的店铺信息" style="max-width:600px; margin:24px auto;">
    <!-- 查看模式 -->
    <template v-if="!isEditing">
      <p><strong>店铺名称：</strong>{{ shopForm.name }}</p>
      <p><strong>地址：</strong>{{ shopForm.address }}</p>
      <p><strong>联系电话：</strong>{{ shopForm.phone }}</p>
      <p><strong>营业时间：</strong>{{ shopForm.businessHours }}</p>
      <a-button type="primary" @click="startEdit">编辑</a-button>
    </template>

    <!-- 编辑模式 -->
    <template v-else>
      <a-form layout="vertical">
        <a-form-item label="店铺名称">
          <a-input v-model:value="shopForm.name" placeholder="请输入店铺名称" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="shopForm.address" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="shopForm.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="营业时间">
          <a-input v-model:value="shopForm.businessHours" placeholder="例如 09:00-21:00" />
        </a-form-item>
      </a-form>
      <a-space style="margin-top: 16px;">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button @click="cancel">取消</a-button>
      </a-space>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'

interface ShopInfo {
  name: string
  address: string
  phone: string
  businessHours: string
}

// 编辑状态
const isEditing = ref(false)

// 表单数据
const shopForm = reactive<ShopInfo>({
  name: '',
  address: '',
  phone: '',
  businessHours: ''
})

// 用于取消时恢复的备份
let backup: ShopInfo = { ...shopForm }

// 加载（或初始化）店铺信息
function loadShopInfo() {
  const raw = localStorage.getItem('my-shop-info')
  if (raw) {
    try {
      Object.assign(shopForm, JSON.parse(raw))
    } catch {
      initDefault()
    }
  } else {
    initDefault()
  }
}

// 写入默认示例
function initDefault() {
  const def: ShopInfo = {
    name: '示例店铺',
    address: '示例路 100 号',
    phone: '13800000000',
    businessHours: '09:00-21:00'
  }
  Object.assign(shopForm, def)
  localStorage.setItem('my-shop-info', JSON.stringify(def))
}

// 点击「编辑」
function startEdit() {
  backup = { ...shopForm }   // 备份当前数据
  isEditing.value = true
}

// 点击「取消」
function cancel() {
  Object.assign(shopForm, backup) // 恢复备份
  isEditing.value = false
}

// 点击「保存」
function save() {
  localStorage.setItem('my-shop-info', JSON.stringify(shopForm))
  message.success('保存成功')
  isEditing.value = false
}

// 组件挂载时加载数据
onMounted(loadShopInfo)
</script>

<style scoped>
/* 可根据需要微调 */
</style>
