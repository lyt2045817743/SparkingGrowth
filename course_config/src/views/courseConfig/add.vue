<template>
  <el-form ref="formEl" :model="form" label-width="150px" :rules="rules">
    <el-form-item label="课程名称：" prop="name">
      <el-input v-model="form.name" style="width: 350px" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="课程类型：" prop="type">
      <el-select v-model="form.type" placeholder="请选择">
        <el-option v-for="(key, val) in CourseTitleMap" :key="key" :label="key" :value="Number(val)" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否为网络资源：" required>
      <el-radio-group v-model="form.hasUrl">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.hasUrl" label="资源链接(url)：" prop="url">
      <el-input v-model="form.url" type="text" style="width: 350px" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="课程目录配置：" required>
      <el-radio-group v-model="form.settingType">
        <el-radio :label="1">简单配置</el-radio>
        <!-- <el-radio :label="2">完整配置</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <div>
        <div>该课程有<input v-model="form.partNum" type="number" @input="initCourseNum" />篇/部分</div>
          <ul v-if="form.partNum">
            <li v-for="num in [...Array(form.partNum)].map((_k, i )=> i)" :key="num">
              <span>第{{ num + 1 }}篇/部分有<input type="number" v-model="form.chapter[num]" @input="() => onChapterChange(num)" />章</span>
              <div v-if="form.chapter[num]">
                <li class="section-li" v-for="sectionNum in [...Array(form.chapter[num])].map((_k, i )=> i)" :key="sectionNum">
                  第{{ sectionNum + 1 }}章有<input type="number" @input="(val) => onSectionChange(val, num, sectionNum)" />节
                </li>
              </div>
            </li>
          </ul>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">仅提交</el-button>
      <el-button type="primary" @click="onSubmitAndTry">提交并立即体验</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CourseTitleMap } from '../../common';
import { addCourse, updateConfig } from './sever';

const router = useRouter();
const formEl = ref(null);
const form = reactive({
  name: '',
  type: '',
  hasUrl: 0,
  url: '',
  settingType: 1,
  partNum: undefined,
  chapter: [],
  section: []
})

const initCourseNum = function () {
  form.chapter = [];
  form.section = [];
}

const onChapterChange = function (chapterIdx) {
  form.section[chapterIdx] = [];
}

const onSectionChange = function(e, chapterIdx, sectionIdx) {
  let { data } = e;
  data = Number(data);
  if (form.section[chapterIdx]) {
    form.section[chapterIdx][sectionIdx] = data;
  } else {
    form.section[chapterIdx] = [data];
  }
}


const onValid = async () => {
  if (!formEl.value) return Promise.resolve(false);
  let flag = false;
  await formEl.value.validate((valid) => {
    if (valid) {
      flag = customValidate();
    } else {
      alert('课程信息校验未通过，请检查');
    }
  })
  return Promise.resolve(flag);
};

const onRealSubmit = async (callback) => {
  const flag = await onValid();
  if (flag) {
    const { name, type, url, section } = form;
    const courseInfo = {
      name,
      type,
      url,
      partInfoList: section.map((item, index) => ({
        sectionNumPerChapterList: item,
        id: index + 1
      })),
      titleMap: {}
    }
    const courseId = await addCourse(courseInfo);
    callback(courseId);
  }
}

const onSubmit = async () => {
  onRealSubmit(() => {
    alert('添加成功！');
    router.push('/list');
  });
}

const onSubmitAndTry = async () => {
  onRealSubmit((courseId) => {
    updateConfig('currentCourseId', courseId);
    window.location.replace('/what_to_study_today');
  });
}

const customValidate = () => {
  if (form.partNum === 0) {
    alert('课程篇数不能为0');
    return false;
  }
  if (!form.partNum || form.chapter.length != form.partNum || form.chapter.filter(item => !item).length > 0 || form.section.map(item => item.length).reduce((a, b) => a + b, 0) !== form.chapter.reduce((a, b) => a + b, 0)) {
    alert('请先将课程目录配置补充完整');
    return false;
  }
  return true;
}

const rules = reactive({
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
  ],
  type: [
    {
      required: true,
      message: '请选择课程类型',
      trigger: 'change',
    },
  ],
  url: [
    {
      required: true,
      message: '请输入课程链接',
      trigger: 'blur',
    },
  ],
})

</script>

<style scoped>
.section-li {
  margin-left: 15px;
  list-style: circle;
}
input {
  margin: 0 5px;
}
</style>
