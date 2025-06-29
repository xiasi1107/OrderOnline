<template>
  <!-- 一行四列：汇总指标 -->
  <a-row gutter="16" class="stat-card-wrap">
    <a-col :span="6">
      <a-card>
        <p class="stat-title">累计营业额 (元)</p>
        <p class="stat-value">{{ summary.totalRevenue.toFixed(2) }}</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <p class="stat-title">总订单数</p>
        <p class="stat-value">{{ summary.totalOrders }}</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <p class="stat-title">销售总件数</p>
        <p class="stat-value">{{ summary.totalItems }}</p>
      </a-card>
    </a-col>
    <a-col :span="6">
      <a-card>
        <p class="stat-title">客单价 (元)</p>
        <p class="stat-value">{{ summary.averageOrderValue.toFixed(2) }}</p>
      </a-card>
    </a-col>
  </a-row>

  <!-- 最近 30 天营收趋势表 -->
  <a-card title="最近 30 天营收趋势" style="margin-top: 20px;">
    <a-table
      :columns="trendColumns"
      :data-source="revenueTrend"
      row-key="date"
      :pagination="{ pageSize: 10 }"
      size="middle"
    ></a-table>
  </a-card>

  <!-- 用餐时间分布 -->
  <a-card title="用餐时间分布" style="margin-top: 20px;">
    <a-row gutter="24">
      <a-col
        v-for="item in mealDistWithPercent"
        :key="item.mealTime"
        :span="6"
        class="meal-col"
      >
        <p>{{ item.mealTime }}</p>
        <a-progress
          type="circle"
          :percent="item.percent"
          :format="() => item.count + ' 单'"
        ></a-progress>
      </a-col>
    </a-row>
  </a-card>

  <!-- 热销商品排行榜 -->
  <a-card title="热销商品排行榜" style="margin-top: 20px;">
    <a-table
      :columns="topColumns"
      :data-source="topProducts"
      row-key="name"
      :pagination="{ pageSize: 8 }"
      size="middle"
    ></a-table>
  </a-card>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { message } from 'ant-design-vue'

/** ---- 类型定义 ---- */
interface Summary {
  totalRevenue: number
  totalOrders: number
  totalItems: number
  averageOrderValue: number
}
interface TrendItem {
  date: string         // 'YYYY-MM-DD'
  revenue: number
}
interface MealDist {
  mealTime: string     // '早餐'|'午餐'|'晚餐'|'零售'
  count: number
}
interface TopProd {
  name: string
  quantity: number
}

/** ---- 响应式状态 ---- */
const summary = reactive<Summary>({
  totalRevenue: 0,
  totalOrders: 0,
  totalItems: 0,
  averageOrderValue: 0,
})
const revenueTrend = ref<TrendItem[]>([])
const mealDist = ref<MealDist[]>([])
const topProducts = ref<TopProd[]>([])

/** ---- 计算用餐分布百分比 ---- */
const mealDistWithPercent = computed(() => {
  const total = mealDist.value.reduce((sum, it) => sum + it.count, 0) || 1
  return mealDist.value.map(it => ({
    ...it,
    percent: Math.round((it.count / total) * 100),
  }))
})

/** ---- 表格列定义 ---- */
const trendColumns = [
  { title: '日期', dataIndex: 'date', key: 'date' },
  {
    title: '营业额 (元)',
    dataIndex: 'revenue',
    key: 'revenue',
    customRender: ({ text }: { text: number }) => text.toFixed(2),
  },
]
const topColumns = [
  { title: '商品名称', dataIndex: 'name', key: 'name' },
  { title: '销售数量', dataIndex: 'quantity', key: 'quantity' },
]

/** ---- API 调用 ---- */
async function fetchSummary() {
  try {
    const res = await axios.get('/api/shopper/statistics/summary')
    if (res.data.success) {
      Object.assign(summary, res.data.data)
    } else {
      throw new Error(res.data.message || '获取失败')
    }
  } catch (e: any) {
    message.error('加载汇总失败：' + e.message)
  }
}

async function fetchTrend() {
  try {
    const res = await axios.get('/api/shopper/statistics/revenueTrend')
    if (res.data.success) {
      revenueTrend.value = res.data.data
    } else {
      throw new Error(res.data.message || '获取失败')
    }
  } catch (e: any) {
    message.error('加载营收趋势失败：' + e.message)
  }
}

async function fetchMealDist() {
  try {
    const res = await axios.get('/api/shopper/statistics/mealTimeDistribution')
    if (res.data.success) {
      mealDist.value = res.data.data
    } else {
      throw new Error(res.data.message || '获取失败')
    }
  } catch (e: any) {
    message.error('加载用餐分布失败：' + e.message)
  }
}

async function fetchTopProducts() {
  try {
    const res = await axios.get('/api/shopper/statistics/topProducts')
    if (res.data.success) {
      topProducts.value = res.data.data
    } else {
      throw new Error(res.data.message || '获取失败')
    }
  } catch (e: any) {
    message.error('加载热销排行失败：' + e.message)
  }
}

onMounted(() => {
  fetchSummary()
  fetchTrend()
  fetchMealDist()
  fetchTopProducts()
})
</script>

<style scoped>
.stat-card-wrap {
  margin-bottom: 20px;
}
.stat-title {
  color: #888;
  margin: 0;
  font-size: 14px;
}
.stat-value {
  margin: 8px 0 0;
  font-size: 24px;
  font-weight: bold;
}
.meal-col {
  text-align: center;
}
</style>

<!-- ===== 接口文档 ===== -->
<!--
GET  /shopper/statistics/summary
描述：店铺运营汇总指标
返回：
{
  success: true,
  data: {
    totalRevenue: number,      // 总营业额
    totalOrders: number,       // 总订单数
    totalItems: number,        // 销售总件数
    averageOrderValue: number  // 客单价
  }
}

GET  /shopper/statistics/revenueTrend
描述：最近一段时间（默认30天）每日营收明细
返回：
{
  success: true,
  data: Array<{
    date: string,    // 'YYYY-MM-DD'
    revenue: number  // 当日营业额
  }>
}

GET  /shopper/statistics/mealTimeDistribution
描述：用餐时间分布统计
返回：
{
  success: true,
  data: Array<{
    mealTime: string,  // '早餐'|'午餐'|'晚餐'|'零售'
    count: number      // 该时段订单数或销售量
  }>
}

GET  /shopper/statistics/topProducts
描述：热销商品排行榜（按销售件数降序）
返回：
{
  success: true,
  data: Array<{
    name: string,     // 商品名称
    quantity: number  // 销售件数
  }>
}
-->
