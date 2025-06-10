<template>
  <a-drawer
    title="创建新菜品"
    :width="500"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form 
     :model="form" 
     :rules="rules" 
     layout="vertical"
     ref="formRef"
    >
      <!--菜品名称-->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="菜品名称" name="name">
            <a-input v-model:value="form.name" placeholder="请输入菜品名称" />
          </a-form-item>
        </a-col>    
      </a-row>

      <!--菜品图片-->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="菜品图片" name="image">
            <a-upload
              name="image"
              :action="uploadAction"
              :show-file-list="true"
              :before-upload="beforeUpload"
              :file-list="fileList"
              @change="handleUploadChange"
            >
              <a-button type="primary">上传图片</a-button>
            </a-upload>
            <div v-if="form.image" class="upload-preview">
              <img :src="form.image" alt="预览图" style="max-width: 200px; margin-top: 10px;" />
            </div>

          </a-form-item>
        </a-col>
      </a-row>

      <!--菜品分类-->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="菜品分类" name="categoryname">
            <a-textarea
              v-model:value="form.categoryname"
              placeholder="输入菜品分类"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!--菜品价格-->
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="菜品价格" name="price">
            <!-- 直接绑定 form.price，使用 InputNumber 组件 -->
            <a-input-number
              v-model:value="form.price"
              placeholder="请输入售价"
              :min="0.1"
              :max="9999"
              :precision="2"
              :addon-after="'元'"
            />
          </a-form-item>
        </a-col>  
        <a-col :span="6">
          <a-form-item label="上架选择" name="onsale">
            <a-switch  v-model:checked="form.onsale" checked-children="上架" un-checked-children="下架" style="margin-left: 10px;"/>
          </a-form-item>
        </a-col>
      </a-row>

      <!--菜品标签-->
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="菜品标签" name="tags">
            <div>
              <a-tag
                v-for="(tag, index) in form.tags"
                :key="tag"
                closable
                @close="removeTag(index)"
                style="margin-bottom: 8px"
              >
                {{ tag }}
              </a-tag>
              <a-input
                v-if="inputVisible"
                v-model:value="inputValue"
                ref="inputRef"
                size="small"
                style="width: 120px"
                @blur="handleInputConfirm"
                @keyup.enter="handleInputConfirm"
              />
              <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                + 添加标签
              </a-tag>
            </div>
          </a-form-item>
        </a-col>
      </a-row>

      <!--菜品描述-->
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="菜品描述" name="desc">
            <a-textarea
              v-model:value="form.desc"
              :rows="4"
              placeholder="请输入菜品描述"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template #extra>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button 
         type="primary" 
          @click="handleSubmit"
          :loading="loading"
        >
          提交
        </a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, defineEmits } from 'vue';
import { 
  message, 
  FormInstance, 
} from 'ant-design-vue'; // 显式导入组件类型
import axios from 'axios';

// 表单引用类型声明
const formRef = ref<FormInstance>(); // Ant Design表单实例类型

// 表单数据模型（带类型注解）
interface DishForm {
  name: string;
  image: string;
  categoryname: string;
  price: number;
  onsale: boolean; // 存储为字符串（与Select值保持一致）
  desc: string;
  tags: string[]; // 新增字段：标签列表
}
const form = reactive<DishForm>({
  name: '',
  image: '',
  categoryname: '',
  price: 0,
  onsale: true, // 是否上架（true=上架，false=下架）
  desc: '',
  tags: [],
});

// 表单验证规则（TypeScript类型适配）
const rules = reactive<Record<string, any[]>>({ // 使用reactive包裹规则
  name: [
    { required: true, message: '请输入菜品名称', whitespace: true },
    { min: 2, max: 20, message: '名称长度需在2-20字之间' }
  ],
  image: [{ required: true, message: '请上传菜品图片' }],
  classification: [{ required: true, message: '请输入菜品分类' }],
  price: [
    { required: true, message: '请输入售价' },
  ],
  onsale: [{ required: true, message: '请选择上架状态' }],
  description: [{ required: true, message: '请输入菜品描述', min: 10 }]
});

// 图片上传
const uploadAction = 'http://localhost:8080/shopper/dish/uploadimage'; // 注意加上 http://
const fileList = ref<any[]>([]);

const handleUploadChange = (info: any) => {
  fileList.value = [...info.fileList]; // ✅ 始终更新 fileList
  console.log(fileList.value);
  if (info.file.status === 'done') {
    const response = info.file.response;
    if (response?.url) {
      form.image = response.url; // ✅ 把服务器返回的图片 URL 存入表单字段
      message.success('图片上传成功');
    } else {
      message.error('上传失败：未获取到图片地址');
    }
  } else if (info.file.status === 'error') {
    message.error('上传失败，请检查网络或格式');
    // 测试
    //form.photo = "/resource/dishphotos/hutao.jpg";
    fileList.value = [];
    form.image = '';
  } 
};

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    message.error('只能上传图片格式');
    return false;
  }

  if (!isLt2M) {
    message.error('图片必须小于 2MB');
    return false;
  }

  // 用 FileReader 或 createObjectURL 创建预览（仅本地预览用）（斯巴拉西）
  const url = URL.createObjectURL(file);
  form.image = url;

  return true;
};

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

// 表单提交
const handleSubmit = async () => {
  try {
    // 可选链操作符 ?. 是 ES2020 新增的语法，用于在访问对象属性或方法时自动做 空值判断，避免报错
    loading.value = true; // 开始 loading
    await formRef.value?.validate(); // 校验表单

    // ✅ 可根据需要调整接口地址
    const response = await axios.post('/api/shopper/dish/createddish', form);

    if (response.data?.success) {
      message.success('菜品创建成功');
      emit('refresh'); // ✅ 发出事件
      onClose(); // 关闭抽屉
      resetForm(); // 重置表单
      // 你也可以触发父组件的刷新，比如 emit('refresh')，下面备注有说明
    } else {
      message.error(response.data?.message || '创建失败，请重试');
    }
  } catch (error) {
    message.error('提交出错：' + (error as any).message);
    //emit('refresh'); // ✅ 测试发出事件（成功）
  } finally {
    loading.value = false; // 结束 loading
  }
};
const resetForm = () => {
  form.name = '';
  form.image = '';
  form.categoryname = '';
  form.price = 0;
  form.onsale = true;
  form.desc = '';
  form.tags = [];
  formRef.value?.clearValidate(); // 清除验证错误
  fileList.value = []; // ✅ 清空上传列表
};

///////////////////////////////////////////////

// tag处理
import { nextTick } from 'vue'

const inputVisible = ref(false);
const inputValue = ref('');
const inputRef = ref<HTMLInputElement>();

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleInputConfirm = () => {
  const value = inputValue.value.trim();
  if (value && !form.tags.includes(value)) {
    form.tags.push(value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};

const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

//////////////////////////////////////////////

// 抽屉状态
const open = ref<boolean>(false);
const loading = ref(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
  resetForm();
};

defineExpose({
  showDrawer
})

</script>

<style>
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
