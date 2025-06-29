<template>
  <div class="content-area">
    <!-- 查询行 -->
    <div class="order-search-row">
      <span>套餐名称：</span>
      <a-input
        v-model:value="lookforName"
        placeholder="请输入套餐名称"
        class="order-input"
      />

      <span style="margin-left: 15px;">标签：</span>
      <a-select
        v-model:value="lookforTags"
        mode="tags"
        allow-clear
        placeholder="请输入或选择标签"
        class="order-input"
        style="min-width: 180px"
      >
        <a-select-option
          v-for="tag in tagOptions"
          :key="tag"
          :value="tag"
        >{{ tag }}</a-select-option>
      </a-select>

      <span style="margin-left: 15px;">售卖状态：</span>
      <a-select
        v-model:value="lookforOnsale"
        allow-clear
        class="order-input"
      >
        <a-select-option value="true">在售</a-select-option>
        <a-select-option value="false">已下架</a-select-option>
      </a-select>

      <a-button
        type="primary"
        style="margin-left: 15px;"
        @click="applyFilter"
        :loading="loading"
      >查询</a-button>

      <a-popconfirm
        title="删除后不可恢复，确认删除？"
        ok-text="是"
        cancel-text="否"
        @confirm="handleBatchDelete"
      >
        <a-button
          type="link"
          danger
          style="margin-left: 15px;"
        >批量删除</a-button>
      </a-popconfirm>
      <span v-if="state.selectedRowKeys.length > 0" style="margin-left:8px;">
        已选中 {{ state.selectedRowKeys.length }}
      </span>

      <a-button
        type="primary"
        @click="showAddDrawer"
        class="custom-add-button"
        style="float: right;"
      >
        <template #icon><PlusOutlined /></template>
        新增套餐
      </a-button>
    </div>

    <!-- 列表 -->
    <a-table
      :columns="columns"
      :data-source="data"
      row-key="key"
      :row-selection="{
        selectedRowKeys: state.selectedRowKeys,
        onChange: onSelectChange
      }"
      :loading="loading"
      size="middle"
      style="margin-top: 5px;"
      :pagination="{ pageSize: 7 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex==='image'">
          <a-image :src="record.image" alt="图片加载失败" style="max-width:50px;" />
        </template>
        <template v-else-if="column.dataIndex==='tags'">
          <a-space>
            <a-tag v-for="(t,i) in record.tags" :key="i" color="blue">{{ t }}</a-tag>
          </a-space>
        </template>
        <template v-else-if="column.dataIndex==='price'">
          {{ record.price }} 元
        </template>
        <template v-else-if="column.dataIndex==='onsale'">
          <span>{{ record.onsale ? '在售' : '已下架' }}</span>
        </template>
        <template v-else-if="column.dataIndex==='operation'">
          <template v-if="record.onsale">
            <a-popconfirm
              title="确认下架？"
              ok-text="是"
              cancel-text="否"
              @confirm="toggleOnSale(record)"
            >
              <a-button size="small" type="link">下架</a-button>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm
              title="确认上架？"
              ok-text="是"
              cancel-text="否"
              @confirm="toggleOnSale(record)"
            >
              <a-button size="small" type="link">上架</a-button>
            </a-popconfirm>
          </template>
          <a-button size="small" type="link" @click="handleView(record)">查看</a-button>
          <a-popconfirm
            title="删除后不可恢复，确认删除？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleDelete(record.key)"
          >
            <a-button size="small" type="link" danger>删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>

  <!-- 查看详情 Modal -->
  <a-modal
    v-model:open="isModalVisible"
    title="套餐详情"
    :footer="null"
    width="500px"
    @cancel="closeModal"
  >
    <template v-if="currentRecord">
      <p><strong>名称：</strong>{{ currentRecord.name }}</p>
      <p><strong>价格：</strong>{{ currentRecord.price }} 元</p>
      <p><strong>状态：</strong>{{ currentRecord.onsale ? '在售' : '已下架' }}</p>
      <p>
        <strong>标签：</strong>
        <a-space>
          <a-tag v-for="(t,i) in currentRecord.tags" :key="i" color="blue">{{ t }}</a-tag>
        </a-space>
      </p>
      <p><strong>描述：</strong>{{ currentRecord.desc }}</p>
      <div v-if="currentRecord.image">
        <strong>图片：</strong>
        <a-image :src="currentRecord.image" width="100px" />
      </div>
    </template>
  </a-modal>

  <!-- 新增套餐 Drawer -->
  <a-drawer
    v-model:open="isAddVisible"
    title="新增套餐"
    width="400px"
    @close="closeAddDrawer"
  >
    <a-form
      ref="addFormRef"
      :model="addForm"
      :rules="addRules"
      label-col="{ span: 6 }"
      wrapper-col="{ span: 16 }"
      layout="horizontal"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="addForm.name" placeholder="请输入套餐名称" />
      </a-form-item>
      <a-form-item label="价格" name="price">
        <a-input-number
          v-model:value="addForm.price"
          :min="0"
          style="width:100%;"
        />
      </a-form-item>
      <a-form-item label="状态" name="onsale">
        <a-switch v-model:checked="addForm.onsale" checked-children="在售" un-checked-children="下架" />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="addForm.tags"
          mode="tags"
          allow-clear
          placeholder="请输入或选择标签"
        >
          <a-select-option
            v-for="tag in tagOptions"
            :key="tag"
            :value="tag"
          >{{ tag }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="图片URL" name="image">
        <a-input v-model:value="addForm.image" placeholder="请输入图片链接" />
      </a-form-item>
      <a-form-item label="描述" name="desc">
        <a-input-textarea
          v-model:value="addForm.desc"
          rows="3"
          placeholder="请输入描述"
        />
      </a-form-item>
      <a-form-item wrapper-col="{ offset: 6, span: 16 }">
        <a-space>
          <a-button type="primary" @click="handleAdd" :loading="loading">保存</a-button>
          <a-button @click="closeAddDrawer">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import {
  Button,
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  Modal,
  Drawer,
  Form,
  Tag,
  Space,
  Image,
  Popconfirm
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

// ------ 类型 ------
type Key = string | number;
interface DataType {
  key: Key;
  name: string;
  desc: string;
  price: number;
  image: string;
  tags: string[];
  onsale: boolean;
}

// ------ 列定义 ------
const columns = [
  { title: '套餐名称', dataIndex: 'name', key: 'name' },
  { title: '图片',      dataIndex: 'image', key: 'image' },
  { title: '标签',      dataIndex: 'tags', key: 'tags' },
  { title: '价格',      dataIndex: 'price', key: 'price' },
  { title: '状态',      dataIndex: 'onsale', key: 'onsale' },
  { title: '操作',      dataIndex: 'operation', key: 'operation' }
];

// ------ 状态 & 数据 ------
const loading = ref(false);
const allData = ref<DataType[]>([]);
const data = ref<DataType[]>([]);
const tagOptions = ref<string[]>([]);
const state = reactive<{ selectedRowKeys: Key[] }>({ selectedRowKeys: [] });

// 筛选字段
const lookforName = ref<string>('');
const lookforTags = ref<string[]>([]);
const lookforOnsale = ref<string>('');

// 查看 Modal
const isModalVisible = ref(false);
const currentRecord = ref<DataType | null>(null);
const handleView = (rec: DataType) => {
  currentRecord.value = rec;
  isModalVisible.value = true;
};
const closeModal = () => { isModalVisible.value = false; };

// 多选回调
const onSelectChange = (keys: Key[]) => {
  state.selectedRowKeys = keys;
};

// 批量删除
const handleBatchDelete = async () => {
  if (!state.selectedRowKeys.length) {
    message.warning('请先选择要删除的套餐');
    return;
  }
  try {
    const res = await axios.post('/api/shopper/set/batchDelete', {
      ids: state.selectedRowKeys
    });
    if (res.data.success) {
      message.success('批量删除成功');
      state.selectedRowKeys = [];
      fetchList();
    } else {
      message.error(res.data.message || '删除失败');
    }
  } catch (e: any) {
    message.error('请求出错：' + e.message);
  }
};

// 单条删除
const handleDelete = async (id: Key) => {
  try {
    const res = await axios.delete(`/api/shopper/set/delete/${id}`);
    if (res.data.success) {
      message.success('删除成功');
      state.selectedRowKeys = state.selectedRowKeys.filter(k => k !== id);
      fetchList();
    } else {
      message.error(res.data.message || '删除失败');
    }
  } catch (e: any) {
    message.error('请求出错：' + e.message);
  }
};

// 上下架切换
const toggleOnSale = async (rec: DataType) => {
  try {
    const newStatus = !rec.onsale;
    const res = await axios.post('/api/shopper/set/updateOnSale', {
      id: rec.key,
      onsale: newStatus
    });
    if (res.data.success) {
      message.success('状态更新成功');
      rec.onsale = newStatus;
    } else {
      message.error(res.data.message || '更新失败');
    }
  } catch (e: any) {
    message.error('请求出错：' + e.message);
  }
};

// 拉取列表
const fetchList = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await axios.get('/api/shopper/set/getSetList');
    if (res.data.success) {
      const raw: any[] = res.data.content;
      allData.value = raw.map((item, idx) => ({
        key: item.id ?? idx,
        name: item.name,
        desc: item.desc,
        price: item.price,
        image: item.image,
        onsale: item.onsale,
        tags: item.tags || []
      }));
      tagOptions.value = Array.from(
        new Set(allData.value.flatMap(i => i.tags))
      );
      applyFilter();
    } else {
      message.error(res.data.message || '获取列表失败');
    }
  } catch (e: any) {
    message.error('请求出错：' + e.message);
  } finally {
    loading.value = false;
  }
};

// 前端筛选
const applyFilter = () => {
  data.value = allData.value.filter(item => {
    const m1 = !lookforName.value || item.name.includes(lookforName.value);
    const m2 =
      !lookforTags.value.length ||
      lookforTags.value.every(tag => item.tags.includes(tag));
    const m3 =
      !lookforOnsale.value ||
      String(item.onsale) === lookforOnsale.value;
    return m1 && m2 && m3;
  });
};

// ========== 新增 Drawer ==========
const isAddVisible = ref(false);
const showAddDrawer = () => { isAddVisible.value = true; };
const closeAddDrawer = () => { isAddVisible.value = false; };

const addFormRef = ref();
const addForm = reactive<Partial<DataType>>({
  name: '',
  price: 0,
  desc: '',
  image: '',
  onsale: true,
  tags: []
});
const addRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
};

const handleAdd = () => {
  addFormRef.value
    .validate()
    .then(async () => {
      loading.value = true;
      try {
        const res = await axios.post('/api/shopper/set/addSet', addForm);
        if (res.data.success) {
          message.success('新增成功');
          closeAddDrawer();
          // 重置
          Object.assign(addForm, { name:'', price:0, desc:'', image:'', onsale:true, tags:[] });
          fetchList();
        } else {
          message.error(res.data.message || '新增失败');
        }
      } catch (e: any) {
        message.error('请求出错：' + e.message);
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      message.warning('请检查表单');
    });
};

onMounted(fetchList);
</script>

<style scoped>
.content-area {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 20px;
  margin: 20px auto;
  min-height: 500px;
  max-height: 800px;
}
.order-input {
  width: 15%;
  min-width: 120px;
}
.custom-add-button {
  width: 100px;
  background-color: #7373f6;
  border-color: #7373f6;
  color: #fff;
}
.custom-add-button:hover {
  background-color: #5a5ada;
  border-color: #5a5ada;
}
</style>
/**
 * GET  /shopper/set/getSetList
 * 描述：获取所有套餐列表（不分页）
 * 请求参数：无
 * 返回示例：
 * {
 *   success: true,
 *   message: "查询成功",
 *   content: [
 *     {
 *       id: 1,
 *       name: "夏日清凉套餐",
 *       desc: "包含西瓜汁+沙拉+冰淇淋",
 *       price: 68.0,
 *       image: "http://.../set1.png",
 *       onsale: true,
 *       tags: ["夏日","清爽"]
 *     },
 *     // ...
 *   ]
 * }
 */

/**
 * POST /shopper/set/addSet
 * 描述：新增一个套餐
 * 请求体 (JSON)：
 * {
 *   name: string,        // 套餐名称，必填
 *   desc?: string,       // 套餐描述，可选
 *   price: number,       // 套餐售价，必填
 *   image?: string,      // 封面图 URL，可选
 *   onsale: boolean,     // 是否在售，true=在售，false=已下架
 *   tags?: string[]      // 标签列表，可选
 * }
 * 返回示例：
 * {
 *   success: true,
 *   message: "新增成功"
 * }
 */

/**
 * POST /shopper/set/batchDelete
 * 描述：批量删除多个套餐
 * 请求体 (JSON)：
 * {
 *   ids: (string|number)[]   // 要删除的套餐 id 列表
 * }
 * 返回示例：
 * {
 *   success: true,
 *   message: "删除成功"
 * }
 */

/**
 * DELETE /shopper/set/delete/{id}
 * 描述：删除单个套餐
 * Path 参数：
 *   id  套餐主键 ID
 * 返回示例：
 * {
 *   success: true,
 *   message: "删除成功"
 * }
 */

/**
 * POST /shopper/set/updateOnSale
 * 描述：切换套餐上下架状态
 * 请求体 (JSON)：
 * {
 *   id: string|number,   // 套餐 ID
 *   onsale: boolean      // 新的上下架状态，true=上架，false=下架
 * }
 * 返回示例：
 * {
 *   success: true,
 *   message: "状态更新成功"
 * }
 */
