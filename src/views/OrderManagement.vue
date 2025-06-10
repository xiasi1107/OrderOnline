<!-- OrderManagement.vue -->
<!--zcx到此一游()-->
<template>
  <div class="order-management-container">
    <div class="order-management-dashboard">
      <a-space direction="vertical">
        <a-radio-group v-model:value="managementtype" button-style="solid"
        class="custom-radio-group"
        >
          <a-radio-button :value="'-1'">全部订单</a-radio-button>
          <a-radio-button :value="'0'">待接单</a-radio-button>
          <a-radio-button :value="'1'">待派送</a-radio-button>
          <a-radio-button :value="'2'">派送中</a-radio-button>
          <a-radio-button :value="'3'">已完成</a-radio-button>
          <a-radio-button :value="'4'">已取消</a-radio-button>
        </a-radio-group>
      </a-space>

        <!-- 新增白色背景内容区域 -->
        <div class="content-area">
          <!-- 新增订单号行 -->
          <div class="order-search-row">
            <a-row>
              <a-col :span="6"><span>订单号：</span>
              <a-input 
              v-model:value="lookforkey" 
              placeholder="请输入订单号" 
              class="order-input"
              />
              </a-col>

              <a-col :span="6"><span>手机号：</span>
              <a-input 
              v-model:value="lookforphone" 
              placeholder="请输入手机号" 
              class="order-input"
              />
              </a-col>
              <a-col :span="1"><a-button type="primary" @click="applyFilter" :loading="loading">查询</a-button></a-col>
            </a-row>
          </div>
          <!-- 订单列表内容 -->
          <a-table
            :columns="columns"
            :data-source="/*managements*/data"
            size="middle"
            :loading="loading"
            :pagination="pagination"
            @change="handleTableChange"
            style="margin-top: 5px;"
          >
            <template #bodyCell="{ column, record }">
              <!--订单状态-->
              <template v-if="column.dataIndex === 'status'">
                <template v-if="record.status === 0">
                  <span style="color: #fa541c;">待接单</span>
                </template>
                <template v-else-if="record.status === 1">
                  <span style="color: #1890ff;">待派送</span>
                </template>
                <template v-else-if="record.status === 2">
                  <span style="color: #13c2c2;">派送中</span>
                </template>
                <template v-else-if="record.status === 3">
                  <span style="color: #52c41a;">已完成</span>
                </template>
                <template v-else-if="record.status === 4">
                  <span style="color:	#f5222d;">已取消</span>
                </template>
              </template>
              <!--操作-->
              <template v-else-if="column.dataIndex === 'operation'">
                <a-button size="small" type="link"  @click="handleView(record)">查看</a-button>
              </template>
            </template>
          </a-table>
        </div>
    </div>
  </div>
    <a-modal
    v-model:open="isModalVisible"
    title="订单详情"
    
    width="500px"
    @cancel="closeModal"
  >
    <template v-if="currentRecord">
      <p><strong>订单号：</strong>{{ currentRecord.key }}</p>
            <p>
        <strong>订单状态：</strong>
        <template v-if="currentRecord.status === 0">
          <span style="color: #fa541c;">待接单</span>
        </template>
        <template v-else-if="currentRecord.status === 1">
          <span style="color: #1890ff;">待派送</span>
        </template>
        <template v-else-if="currentRecord.status === 2">
          <span style="color: #13c2c2;">派送中</span>
        </template>
        <template v-else-if="currentRecord.status === 3">
          <span style="color: #52c41a;">已完成</span>
        </template>
        <template v-else-if="currentRecord.status === 4">
          <span style="color:	#f5222d;">已取消</span>
        </template>
      </p>
      <p>
        <strong>商品费用：</strong>
        <a-space wrap="true">
          <a-tag v-for="(item, idx) in currentRecord.items" :key="idx" color="blue">{{ item.name }} x{{item.quantity}} --- ￥{{item.price}}</a-tag>
        </a-space>
      </p>
      <p><strong>合计：</strong>￥{{currentRecord.totalPrice}}</p>
      <p>
        <strong>用户昵称：</strong>
        {{ currentRecord.contactName }}
      </p>
      <p>
        <strong>用户电话：</strong>
        {{ currentRecord.phone }}
      </p>
      <p>
        <strong>用户地址：</strong>
        {{ currentRecord.address }}
      </p>
      <p>
        <strong>用户备注：</strong>
        {{ currentRecord.remark }}
      </p>
    </template>
    <template #footer>
      <template v-if="currentRecord.status === 0">
          <a-popconfirm
            title="删除后不可以恢复，确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="toggleStatus(currentRecord, 4)"
          >
            <a-button 
            type="primary" 
            danger 
            style="margin-right: 8px;"
            >
              <template #icon><CloseCircleOutlined /></template>
              拒单
            </a-button>
          </a-popconfirm>
        <a-button 
         type="primary"
         @click="toggleStatus(currentRecord, 1)"
        >
          <template #icon><CheckCircleOutlined /></template>
          接单
        </a-button>
      </template>

      <template v-else-if="currentRecord.status === 1">
        <a-button 
         style="background-color: #faad14; color: white; border: none;"
         @click="toggleStatus(currentRecord, 2)"
        >
          <template #icon><RocketOutlined /></template>
          派送
        </a-button>
      </template>

      <template v-else-if="currentRecord.status === 2">
        <a-button 
         style="background-color: #52c41a; color: white; border: none;"
         @click="toggleStatus(currentRecord, 3)"
        >
          <template #icon><CheckOutlined /></template>
          完成
        </a-button>
      </template>
  </template>
  </a-modal>
</template>


<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { CloseCircleOutlined, CheckCircleOutlined, RocketOutlined, CheckOutlined } from '@ant-design/icons-vue';


// 定义获取的数据类型
type item = {
  id: string,
  name: string,
  price: number,
  quantity: number,
}
interface DataType {
    key: string, // 订单ID
    totalPrice: number, // 菜品总价
    contactName: string, // 用户昵称
    phone: string, // 用户电话
    address: string, // 用户地址
    remark: string, // 用户备注
    status: number, // 订单状态（0=待接单，1=待派送，2=派送中，3=已完成，4=已取消）
    createTime: string, // 创建时间
    items: item[]
}

const loading = ref(false);
//表格头
const columns = [
  {
    title: "订单号",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "订单状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "用户昵称",
    dataIndex: "contactName",
    key: "contactName",
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "下单时间",
    dataIndex: "createTime",
    key: "createtime",
  },
  {
    title:"实收金额",
    dataIndex:"totalPrice",
    key:"totalPrice",
  },
  {
    title:"操作",
    dataIndex:"operation",
    key:"operation",
  }
];

const data = ref<DataType[]>([]);
const allData = ref<DataType[]>([]); // ✅ 缓存后端返回的完整数据

////////////////////////////////////////////////

// 数据测试
for (let i = 10; i < 78; ++i){
  allData.value.push(
  {
    key: "2131438ADJ", // 订单ID
    totalPrice: 198, // 菜品总价
    contactName: "唔知叫咩绵", // 用户昵称
    phone: `189246894${i}`, // 用户电话
    address: "泥工C10 105", // 用户地址
    remark: "辣子鸡不要辣", // 用户备注
    status: i % 9 % 5, // 订单状态（0=待接单，1=待派送，2=派送中，3=已完成，4=已取消）
    createTime: "2025-06-08 17:32", // 创建时间
    items: [
      {
        id: "123",
        name: "辣子鸡",
        price: 31,
        quantity: 2,
      },
    ]
  },
);
}

// ✅ 默认显示所有数据
data.value = [...allData.value];
/////////////////////////////////////////

// 数据访问
// onMounted打开页面自动执行
onMounted(() => {
  handleQuery();
})
// 数据查询
const handleQuery = async () => {
  if (loading.value) return; // 正在加载中，直接退出
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8080/shopper/dish/getOrderList');
    const res = response.data;
    if (res.success) {
      // 后端返回的是一个数组
      const rawData: DataType[] = res.data.map((order: any) => ({
        key: order.orderId,
        totalPrice: order.totalPrice,
        items: order.items,
        contactName: order.contactName,
        phone: order.phone,
        address: order.address,
        remark: order.remark,
        status: order.status,
        createTime: order.createTime,
      }));
      
      // ✅ 更新缓存数据
      allData.value = rawData;

      // ✅ 初始化或刷新筛选
      applyFilter();
    }
  } catch (error) {
    message.error("查询失败");
    console.error("查询失败：", error);
  } finally {
    loading.value = false;
  }
};

// 定时轮询
setInterval(async () => {
  console.log("轮询")
  // const response = await axios.get('http://localhost:8080/shopper/order/checknewOrder');
  // if (response.data.newOrder) {
  //   message.info("有新订单！");
  //   handleQuery(); // 重新获取数据
  // }
}, 10000); // 每 10 秒轮询

//////////////////////////////////////////

// 更改状态方法
const toggleStatus = async (record: DataType, newStatus: number) => {
  console.log("测试测试");

    // 测试
    console.log("测试测试2");
    record.status = newStatus;
    data.value = [...data.value];
    closeModal(); // ✅ 新增：关闭弹窗


  try {
    const response = await axios.post('http://localhost:8080/shopper/dish/updateStatus', {
      id: record.key,
      status: newStatus
    });

    if (response.data?.success) {
      message.success('上下架状态已更新');
      handleQuery(); // 刷新数据
      closeModal(); // ✅ 新增：关闭弹窗
    } else {
      message.error(response.data?.message || '更新失败');
    }
  } catch (error) {
    console.error("错误信息：", error); // ✅ 打印具体错误
    message.error('操作失败：' + (error as any).message);
  }
};


//////////////////////////////////////////

const managementtype = ref<string>('-1'); // 订单类型
const lookforphone = ref<string>('');
const lookforkey = ref<string>('');

watch(managementtype, () => {
  applyFilter();
});

// 筛选订单显示
const applyFilter = () => {
  loading.value = true;
  data.value = allData.value.filter(item => {
    // 对项做bool判断，先判断不为空，再判断项
    const typeMatch = managementtype.value === '-1' || String(item.status) === managementtype.value;

    const phoneMatch =
      !lookforphone.value.length || item.phone.includes(lookforphone.value);

    const keyMatch =
      !lookforkey.value || item.key.includes(lookforkey.value);

    return typeMatch && phoneMatch && keyMatch;
  });
  loading.value = false;
};

//////////////////////////////////////////

// 查看方法

// 控制 Modal 显示与隐藏
const isModalVisible = ref(false);
// 当前选中行的数据
const currentRecord = ref<DataType | null>(null);
// 点击查看按钮时触发
const handleView = (record: DataType) => {
  currentRecord.value = record;
  isModalVisible.value = true;
};
// 关闭弹窗
const closeModal = () => {
  isModalVisible.value = false;
};




</script>

<style scoped>

.order-management-dashboard {
  padding: 20px;
  width: 100%;
  margin: 0 auto;        /* 水平居中 */
  flex: 1;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

:deep(.custom-radio-group .ant-radio-button-wrapper) {
  flex: 1; /* 平均分配宽度 */
  min-width: 100px; /* 设置最小宽度 */
  text-align: center; /* 文字居中 */
}

/* 选中状态样式 */
:deep(.custom-radio-group .ant-radio-button-wrapper-checked) {
  background-color:  #7373f6 !important;
  border-color:  #5959c5;
  color: white;
  box-shadow: 0 2px 5px rgba(255, 125, 0, 0.3);
}

/* 新增：白色背景内容区域样式 */
.content-area {
  background-color: white; /* 白色背景 */
  border-radius: 8px;      /* 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 轻微阴影 */
  padding: 20px;           /* 内边距 */
  margin-top: 20px;        /* 与上方按钮的间距 */

  width: 100%;           /* 宽度自适应父容器 */
  height: 100%;
  margin: 20px auto 0;   /* 水平居中 */
  min-height: 645px;     /* 最小高度 */
  max-height: 645px;     /* 最大高度 */
}

/* 输入框样式 */
.order-input {
  width: 250px; /* 输入框长度 */
  max-width: 100%; /* 响应式适配 */
}
</style>
