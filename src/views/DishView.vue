<template>
  <!-- 新增白色背景内容区域 -->
  <div class="content-area">
    <!-- 新增订单号行 -->
    <div class="order-search-row">
        <!--订单号查询输入区域-->
        <span style="margin-right: 0px;">菜品名称：</span>
        <a-input 
        v-model:value="lookforname" 
        placeholder="请输入菜品名字" 
        class="order-input"
        />
        <!--菜品分类查询输入区域-->
        <span style="margin-left: 15px;">菜品分类：</span>
        <a-select
          v-model:value="lookforcategoryList"
          mode="tags"
          allow-clear
          placeholder="请输入或选择分类"
          class="order-input"
          style="min-width: 180px"
        >
          <a-select-option
            v-for="item in categoryOptions"
            :key="item"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
        <!--售卖状态查询输入区域-->           
        <span style="margin-left: 15px;">售卖状态：</span>
        <a-select v-model:value="lookforonsale" class="order-input" allow-clear>
          <a-select-option key="1" value="true">在售</a-select-option>
          <a-select-option key="2" value="false">已下架</a-select-option>
        </a-select>

        <!--查询按钮，点击后根据订单号和菜品分类和售卖状态获取数据-->
        <!--看接下来是：1、每次查询根据条件获取数据，2、根据查询条件获取全部数据，前端对数据二次选择显示-->
        <a-button 
          type="primary" 
          style="margin-left: 15px;" 
          @click="applyFilter"
          :loading="loading"
        >
          查询
        </a-button>

        <!--批量删除按钮，popconfirm二次确认-->
        <a-popconfirm
          title="删除后不可以恢复，确认删除?"
          ok-text="是"
          cancel-text="否"
          @confirm="handleBatchDelete"
        >
          <a-button type="link" danger style="margin-left: 15px;">
            批量删除
          </a-button>
        </a-popconfirm>
        <span v-if="state.selectedRowKeys.length > 0">
          已选中{{state.selectedRowKeys.length}}
        </span>

        <!--新增菜品按钮，会调用AddDishForm组件，新增以后应该自动从后端重新获得一次数据-->
        <a-button 
          type="primary" 
          @click="AddDish"
          class="custom-add-button"
          style="margin-right: 25px;float: right;"
        >
          <template #icon><PlusOutlined /></template>
            新增菜品
        </a-button>
        <AddDishForm ref="refAddDish" @refresh="handleQuery"/>
        
    </div>
    <!-- 订单列表内容 -->
    <!--
    :columns定义列表头
    :data-source定义数据源，数据源是object数组
    :row-selection多选条目
    |--selectedRowKeys选择的条目
    |--
    -->
    <a-table
      :columns="columns"
      :data-source="data"
      size="middle"    
      style="margin-top: 5px;"
      :loading="loading"
      :pagination="{ pageSize: 7 }"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <!--图片-->
        <template v-if="column.dataIndex === 'image'">
          <a-image :src="record.image" alt="图片加载失败" style="max-width: 50px;" />
        </template>

          <!-- 标签 -->
        <template v-else-if="column.dataIndex === 'tags'">
          <a-space>
            <a-tag v-for="(tag, idx) in record.tags" :key="idx" color="blue">{{ tag }}</a-tag>
          </a-space>
        </template>

        <!--售卖价格-->
        <template v-else-if="column.dataIndex === 'price'">
          {{record.price}}元
        </template>

        <!--售卖状态-->
        <template v-else-if="column.dataIndex === 'onsale'">
          <template v-if="record.onsale === true">
            <span>在售</span>
          </template>
          <template v-else-if="record.onsale === false">
            <span>已下架</span>
          </template>
        </template>

        <!--操作-->
        <template v-else-if="column.dataIndex === 'operation'">
          <template v-if="record.onsale === true">
            <a-popconfirm
              title="确认下架吗?"
              ok-text="是"
              cancel-text="否"
              @confirm="toggleOnSale(record)"
            >
              <a-button size="small" type="link">下架</a-button>
            </a-popconfirm>
          </template>
          <template v-if="record.onsale === false">
            <a-popconfirm
              title="确认上架吗?"
              ok-text="是"
              cancel-text="否"
              @confirm="toggleOnSale(record)"
            >
              <a-button size="small" type="link">上架</a-button>
            </a-popconfirm>
          </template>
          <!---->
          <a-button size="small" type="link" @click="handleView(record)">查看</a-button>
          <!---->
          <a-popconfirm
            title="删除后不可以恢复，确认删除?"
            ok-text="是"
            cancel-text="否"
            @confirm="handleDelete(record.id)"
          >
            <a-button size="small" type="link" danger>
              删除
            </a-button>
          </a-popconfirm>
        </template>
        
      </template>
    </a-table>
  </div>

  <a-modal
    v-model:open="isModalVisible"
    title="菜品详情"
    :footer="null"
    width="500px"
    @cancel="closeModal"
  >
    <template v-if="currentRecord">
      <div v-if="!isEditing">
        <p><strong>菜品名称：</strong>{{ currentRecord.name }}</p>
        <p><strong>菜品分类：</strong>{{ currentRecord.categoryname }}</p>
        <p><strong>售价：</strong>{{ currentRecord.price }} 元</p>
        <p><strong>售卖状态：</strong>{{ currentRecord.onsale ? '在售' : '已下架' }}</p>
        <p>
          <strong>标签：</strong>
          <a-space>
            <a-tag v-for="(tag, idx) in currentRecord.tags" :key="idx" color="blue">{{ tag }}</a-tag>
          </a-space>
        </p>
        <p>
          <strong>描述：</strong>
          {{ currentRecord.desc }}
        </p>
        <div v-if="currentRecord.image">
          <strong>图片：</strong>
          <a-image :src="currentRecord.image" width="100px" />
        </div>

        <!-- <div style="text-align: right; margin-top: 20px;">
          <a-button @click="isEditing = true" type="primary">编辑</a-button>
        </div> -->
      </div>

      <!-- <div v-else>
        <a-form layout="vertical">
          <a-form-item label="菜品名称">
            <a-input v-model:value="editableData.name" />
          </a-form-item>

          <a-form-item label="分类">
            <a-input v-model:value="editableData.classification" />
          </a-form-item>

          <a-form-item label="售价">
            <a-input-number v-model:value="editableData.price" :min="0" />
          </a-form-item>

          <a-form-item label="售卖状态">
            <a-switch v-model:checked="editableData.onsale" />
          </a-form-item>
        </a-form>

        <div style="text-align: right;">
          <a-button @click="isEditing = false" style="margin-right: 8px;">取消</a-button>
          <a-button type="primary" @click="saveEdit">保存</a-button>
        </div>
      </div> -->
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import {
  PlusOutlined,
} from '@ant-design/icons-vue';
import AddDishForm from '../components/dish/AddDishForm.vue'; // 这里引入AddDishForm的子组件，负责抽屉表单的工作
import { message } from 'ant-design-vue'

// 这里是父组件调用子组件方法相关内容
const refAddDish = ref();
const AddDish= () => {
  refAddDish.value.showDrawer();
}

// 定义获取的数据类型
type Key = string | number;
interface DataType {
    key: Key,
    name: string, // 菜品名字
    desc: string // 描述（详细信息）
    price: number, // 价格
    image: string, // 图片
    categoryId: string, // 菜品id
    categoryname: string, // 菜品分类名
    tags: string[], // 菜品标签
    onsale: boolean, // 销售状态
}

const loading = ref(false);
// 表格头
const columns = [
  {
    title: "菜品名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "图片",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "分类",
    dataIndex: "categoryname",
    key: "categoryname",
  },
  {
    title: "标签",
    dataIndex: "tags",
    key: "tags",
  },
  {
    title: "售价",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "售卖状态",
    dataIndex: "onsale",
    key: "onsale",
  },
  {
    title:"操作",
    dataIndex:"operation",
    key:"operation",
  }
];
const data = ref<DataType[]>([]);
const allData = ref<DataType[]>([]); // ✅ 缓存后端返回的完整数据
const categoryOptions = ref<string[]>([]); // ✅ 分类选项列表
//数据测试
for (let i = 0; i < 46; i++) {
  if(i % 10 < 3)
    allData.value.push({
      key: i,
      name: "鸡蛋瘦肉肠",
      desc: "皓齿！这里是描述内容的测试，接下来是一段乱七八糟的话。开关是灯的日出日落，日出日落是灯的开关。",
      price: 189,
      image: "/resource/dishphotos/hutao.jpg",
      categoryId: "1",
      categoryname: `香香的口味`,
      tags: ["测试","你好"],
      onsale: i % 5 < 3,
    });
  else if(i % 10 < 7)
      allData.value.push({
      key: i,
      name: "陈皮鸭",
      desc: "陈皮加鸭，对吗",
      price: 699,
      image: "/resource/dishphotos/hutao.jpg",
      categoryId: "2",
      categoryname: `好香`,
      tags: ["测试","你好"],
      onsale: i % 5 < 3,
    });
  else
    allData.value.push({
        key: i,
        name: "鹅胗",
        desc: "爬山爱吃。",
        price: 13,
        image: "/resource/dishphotos/hutao.jpg",
        categoryId: "2",
        categoryname: `好香`,
        tags: ["测试","你好"],
        onsale: i % 5 < 3,
      });
}
categoryOptions.value = [
        ...new Set(allData.value.map(item => item.categoryname))
      ];
// ✅ 默认显示所有数据
data.value = [...allData.value];

////////////////////////////////////
// 多行选择
const state = reactive<{
  selectedRowKeys: Key[];
  loading: boolean;
}>({
  selectedRowKeys: [], // 可以在此设定默认选择行Keys
  loading: false,
});


const onSelectChange = (selectedRowKeys: Key[]) => {
  console.log('selectedRowKeys changed: ', selectedRowKeys);
  // 可以用 selectedRowKeys 去从 data 中筛选出对应的数据对象
  const selectedItems = data.value.filter(item => selectedRowKeys.includes(item.key));
  console.log('你选中的行数据对象：', selectedItems);
  state.selectedRowKeys = selectedRowKeys;
};

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

// 批量删除方法
const handleBatchDelete = async () => {
  if (!state.selectedRowKeys.length) {
    message.warning('请先选择要删除的菜品');
    return;
  }

  try {
    // 调用批量删除接口（你可以改为真实接口）
    const response = await axios.post('http://localhost:8080/shopper/dish/batchDelete', {
      ids: state.selectedRowKeys
    });

    if (response.data?.success) {
      message.success('批量删除成功');
      // 清空选中项
      state.selectedRowKeys = [];
      // 重新查询数据
      handleQuery();
    } else {
      message.error(response.data?.message || '批量删除失败');
    }
  } catch (error) {
    message.error('批量删除出错：' + (error as any).message);
  }
};

///////////////////////////////////////////////

// 单个删除处理
const handleDelete = async (id: string | number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/shopper/dish/delete/${id}`);

    if (response.data?.success) {
      message.success('删除成功');

      // 删除选中状态中的该项
      const index = state.selectedRowKeys.indexOf(id);
      if (index !== -1) {
        state.selectedRowKeys.splice(index, 1);
      }

      // 刷新数据
      handleQuery(); 
    } else {
      message.error(response.data?.message || '删除失败');
    }
  } catch (error) {
    message.error('删除出错：' + (error as any).message);
  }
};



///////////////////////////////////

// 上下架方法
const toggleOnSale = async (record: DataType) => {
  try {
    const newStatus = !record.onsale; // 切换状态
    const response = await axios.post('http://localhost:8080/shopper/dish/updateOnSale', {
      id: record.key,
      onsale: newStatus
    });

    if (response.data?.success) {
      message.success('上下架状态已更新');
      handleQuery(); // 刷新数据
    } else {
      message.error(response.data?.message || '更新失败');
    }
  } catch (error) {
    message.error('操作失败：' + (error as any).message);
  }
};


///////////////////////////////////

// 查看方法
// 控制 Modal 显示与隐藏
const isModalVisible = ref(false);

// 当前选中行的数据
const currentRecord = ref<DataType | null>(null);

// const isEditing = ref(false); // 是否为编辑模式

// 临时编辑数据副本
//const editableData = ref<Partial<DataType>>({});
// 点击查看按钮时触发
const handleView = (record: DataType) => {
  currentRecord.value = record;
  //editableData.value = { ...record }; // 创建副本用于编辑
  isModalVisible.value = true;
  // isEditing.value = false; // 默认是只读
};
// 保存编辑
// const saveEdit = () => {
//   if (currentRecord.value && editableData.value) {
//     Object.assign(currentRecord.value, editableData.value); // 将修改同步回原对象
//     isEditing.value = false;
//   }
// };
// 关闭弹窗
const closeModal = () => {
  isModalVisible.value = false;
  // isEditing.value = false;
};

//////////////////////////////////////////

// 数据访问
// onMounted打开页面自动执行
onMounted(() => {
  handleQuery();
})
/*
 * 全部数据查询
 * */

const handleQuery = async () => {
  if (loading.value) return; // 正在加载中，直接退出
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:8080/shopper/dish/getDishList');
    const res = response.data;
    if (res.success) {
      // 后端返回的是一个数组
      const rawData: DataType[] = res.content.map((item: any, index: number) => ({
        key: item.id ?? index,
        name: item.name,
        image: item.image,
        categoryId: item.categoryId,
        categoryname: item.categoryname,
        price: item.price,
        onsale: item.onsale,
        desc: item.desc,
        tags: item.tags,
      }));
      
      // ✅ 更新缓存数据
      allData.value = rawData;

      // ✅ 分类选项（无重复）
      categoryOptions.value = [
        ...new Set(rawData.map(item => item.categoryname))
      ];

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

/////////////////////////////////////////

// 分类查询
const lookforname = ref<string>('');
const lookforcategoryList = ref<string[]>([]);
const lookforonsale = ref<string>('');


const applyFilter = () => {
  data.value = allData.value.filter(item => {
    // 对项做bool判断，先判断不为空，再判断项
    const nameMatch = !lookforname.value || item.name.includes(lookforname.value);
    const categoryMatch =
      !lookforcategoryList.value.length || lookforcategoryList.value.includes(item.categoryname);
    const onsaleMatch =
      !lookforonsale.value || String(item.onsale) === lookforonsale.value;

    console.log(nameMatch, categoryMatch, onsaleMatch)
    return nameMatch && categoryMatch && onsaleMatch;
  });
};

</script>


<style scoped>
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
  min-height: 500px;     /* 最小高度 */
  max-height: 700px;     /* 最大高度 */
}

.order-input {
  width: 15%;
  min-width: 120px;
  max-width: 100%;
}

/* 自定义按钮样式 */
.custom-add-button {
  /* 宽度 */
  width: 100px; 
  padding: 3px;
  
  /* 主颜色（背景色、边框色） */
  background-color: #7373f6; /* 天蓝色（Ant Design 主色变种） */
  border-color: #7373f6;
  color: white;
}

.content-area .custom-add-button:hover {
  /* 悬停样式 */
  background-color: #5a5ada;
  border-color: #5a5ada;
}
</style>
