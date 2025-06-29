<template>
  <a-card title="员工管理" style="margin: 24px">
    <a-space style="width: 100%; margin-bottom: 16px;" align="start">
      <a-input-search
        v-model:value="keyword"
        placeholder="请输入用户名或员工姓名搜索"
        allow-clear
        enter-button="搜索"
        @search="onSearch"
        style="max-width: 300px"
      />
    </a-space>

    <a-table
      :columns="columns"
      :data-source="list"
      :row-key="rowKey"
      :pagination="false"
      :loading="loading"
    />

    <a-pagination
      style="text-align: right; margin-top: 16px;"
      :current="page"
      :page-size="pageSize"
      :total="total"
      @change="onPageChange"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'

// ---- 接口描述 ----
// GET /api/employees
//   参数 (query):
//     page       number  当前页码，1 开始
//     pageSize   number  每页条数
//     keyword    string  可选，用户名或员工姓名模糊搜索
//   返回 (JSON):
//   {
//     code: 0,
//     message: 'success',
//     data: {
//       records: Employee[],
//       total: number
//     }
//   }
//
// Employee {
//   id: number
//   username: string
//   name: string
//   phone: string
//   enabled: boolean
// }
// ----------------

interface Employee {
  id: number
  username: string
  name: string
  phone: string
  enabled: boolean
}

// 状态与表头定义
const columns = ref<ColumnsType<Employee>>([
  { title: '用户名',    dataIndex: 'username', key: 'username' },
  { title: '员工姓名',  dataIndex: 'name',     key: 'name' },
  { title: '手机号',    dataIndex: 'phone',    key: 'phone' },
  {
    title: '启用状态',
    dataIndex: 'enabled',
    key: 'enabled',
    customRender: ({ text }: { text: boolean }) => (text ? '是' : '否')
  }
])

// 列表数据
const list = ref<Employee[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const loading = ref(false)
const rowKey = 'id'

// 从后端拉取员工列表
async function fetchList() {
  loading.value = true
  try {
    // 这里假设你全局已经 axios.defaults.baseURL = '/api'
    const res = await fetch(
      `/api/employees?page=${page.value}&pageSize=${pageSize.value}&keyword=${encodeURIComponent(keyword.value)}`,
      { method: 'GET' }
    )
    const json = await res.json()
    if (json.code !== 0) {
      throw new Error(json.message || '接口返回错误')
    }
    list.value = json.data.records
    total.value = json.data.total
  } catch (err: any) {
    message.error(`员工列表加载失败：${err.message || err}`)
  } finally {
    loading.value = false
  }
}

// 搜索
function onSearch(value: string) {
  keyword.value = value
  page.value = 1
  fetchList()
}

// 分页切换
function onPageChange(p: number) {
  page.value = p
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
/* 如需自定义，请在此添加 */
</style>
