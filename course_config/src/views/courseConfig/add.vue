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
        <el-radio :label="1">简单配置（仅章节数）</el-radio>
        <el-radio :label="2">部分配置（带题目）</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <!-- 简单配置 -->
      <div v-if="form.settingType === 1">
        <div>【简单配置】该课程有<input v-model="form.partNum" type="number" @input="initCourseNum" placeholder="请输入篇数" />篇/部分</div>
          <ul v-if="form.partNum">
            <li v-for="num in [...Array(form.partNum)].map((_k, i )=> i)" :key="num">
              <span>第{{ num + 1 }}篇/部分有<input type="number" placeholder="请输入章数" v-model="form.chapter[num]" @input="() => onChapterChange(num)" />章</span>
              <div v-if="form.chapter[num]">
                <li class="section-li" v-for="sectionNum in [...Array(form.chapter[num])].map((_k, i )=> i)" :key="sectionNum">
                  第{{ sectionNum + 1 }}章有<input type="number" placeholder="请输入节数" @input="(val) => onSectionChange(val, num, sectionNum)" />节
                </li>
              </div>
            </li>
          </ul>
      </div>
      <!-- 部分配置（带题目） -->
      <div v-else class="ccb-inner">
        <div>【部分配置】该课程有<input v-model="form.partNum" type="number" @input="initCourseNum" placeholder="请输入篇数" />篇/部分</div>
        <ul v-if="form.partNum">
          <li v-for="num in [...Array(form.partNum)].map((_k, i )=> i)" :key="num">
              <input :placeholder="`请输入第${ num + 1 }篇题目`" @change="(val) => onChangeTitle(val, num, sectionNum)" />
              ，有<input type="number" placeholder="请输入章数" v-model="form.chapter[num]" @input="() => onChapterChange(num)" />章
            <div v-if="form.chapter[num]">
              <li class="section-li" v-for="sectionNum in [...Array(form.chapter[num])].map((_k, i )=> i)" :key="sectionNum">
                <input :placeholder="`请输入第${ sectionNum + 1 }章题目`" @change="(val) => onChangeTitle(val, num, sectionNum)" />
                ，有<input type="number" placeholder="请输入节数" @input="(val) => onSectionChange(val, num, sectionNum)" />节
                <div v-if="form.section[num]?.[sectionNum]" class="section-title">
                  <li class="section-title-li" v-for="innerNum in [...Array(form.section[num][sectionNum])].map((_k, i )=> i)" :key="innerNum">
                    <input :placeholder="`请输入第${innerNum + 1}节题目`" @change="(val) => onChangeTitle(val, num, sectionNum, innerNum)" />
                  </li>
                </div>
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
const form = ref({
  name: '',
  type: '',
  hasUrl: 0,
  url: '',
  settingType: 1,
  partNum: undefined,
  chapter: [],
  section: [],
  titleMap: {}
})

const initCourseNum = function () {
  form.value.chapter = [];
  form.value.section = [];
}

const onChapterChange = function (chapterIdx) {
  form.value.section[chapterIdx] = [];
}

const onSectionChange = function(e, chapterIdx, sectionIdx) {
  let { value } = e.target;
  const data = Number(value);
  if (form.value.section[chapterIdx]) {
    if (data) {
      form.value.section[chapterIdx][sectionIdx] = data;
    } else {
      form.value.section[chapterIdx].splice(sectionIdx, 1);
    }
  } else {
    form.value.section[chapterIdx] = [data];
  }
}

const onChangeTitle = function(e, ...otherArg) {
  const titleIdxArr = otherArg.map((item) => item + 1).filter(Boolean);
  const titleKey = `Part${titleIdxArr.join('.')}`;
  form.value.titleMap[titleKey] = e.target.value;
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
    const { name, type, url, section, titleMap } = form.value;
    const courseInfo = {
      name,
      type,
      url,
      partInfoList: section.map((item, index) => ({
        sectionNumPerChapterList: item,
        id: index + 1
      })),
      titleMap
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
  const { partNum, chapter, section } = form.value;
  if (partNum === 0) {
    alert('课程篇数不能为0');
    return false;
  }
  if (!partNum ||chapter.length != partNum || chapter.filter(item => !item).length > 0 || section.map(item => item.length).reduce((a, b) => a + b, 0) !== chapter.reduce((a, b) => a + b, 0)) {
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
});

</script>

<style scoped>
.section-li {
  margin-left: 25px;
  list-style: circle;
}

.section-title-li {
  margin-left: 25px;
  text-align: left;
  list-style: disc;
}
input {
  border: 1px solid #dcdfe6;
  padding: 3px;
  margin: 0 5px;
}
</style>
