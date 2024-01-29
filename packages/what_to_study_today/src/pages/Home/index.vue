<template>
    <div class="main">
      <article>
        <div class="title">今天学什么？</div>
        <div class="random-box">
          <div v-if="(partNo || isCustomer) && hasPartInfo" class="random-info-box">
            <div class="random-info-item">
              <div class="rii-title">
                第
                <input v-if="isCustomer" class="numberInput" type="number" v-model="partNo" />
                <span v-else>{{ partNo }}</span>
                篇
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}`]" placeholder="请补充本篇名称" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}`)" />
              </div>
            </div>
            <div class="random-info-item">
              <div class="rii-title">
                第
                <input v-if="isCustomer" class="numberInput" type="number" v-model="chapterNo" />
                <span v-else>{{ chapterNo }}</span>
                章
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}.${chapterNo}`]" placeholder="请补充本章名称" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}.${chapterNo}`)" />
              </div>
            </div>
            <div class="random-info-item">
              <div class="rii-title">
                第
                <input v-if="isCustomer" class="numberInput" type="number" v-model="sectionNo" />
                <span v-else>{{ sectionNo }}</span>
                节
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}.${chapterNo}.${sectionNo}`]" placeholder="请补充本节名称" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}.${chapterNo}.${sectionNo}`)" />
              </div>
            </div>
          </div>
          <div v-if="!hasPartInfo && isCustomer">
            <div class="rii-des customer-content">
              <textarea v-model="allTitle" class="textarea" :maxLength="50" :placeholder="`请补充学习内容，将被添加到学习记录中\n推荐格式：Part1.1：【JavaScript 简介】.【JavaScript 简史】`" />
            </div>
          </div>
          <div class="btn-box">
            <button v-if="!isStudying && hasPartInfo" class="startBtn" @click="onRandom">开始生成随机章节</button>
            <button v-if="!isStudying && hasPartInfo" class="startBtn" @click="onEditCustomerCourse">学习自定义章节</button>
            <button v-if="!isStudying && !hasPartInfo && showCustomerContentBtn" class="startBtn" @click="onEditCustomerContentCourse">学习自定义内容</button>
            <button v-if="(partNo || isCustomer) && !isStudying" class="startBtn" @click="onStartStudy">开始学习</button>
            <button v-if="isStudying" class="startBtn finishStudyBtn" @click="onFinish">完成学习</button>
          </div>
        </div>
        <div class="current-course">
          <div class="cc-title">
            <span class="cct-text">当前学习资源</span>
            <Tooltip content="点击系统左上角，在首页【内容配置后台】进行配置" placement="top" :left="50">
              <img src="@/assets/icons/help-filling.png" width="15" height="15" class="help-icon" />
            </Tooltip>
            <span>：</span>
          </div>
          <select class="change-course" placeholder="切换学习资源" @change="onCourseChange">
            <option v-for="item in courseList" :key="item.id" :value="item.id" class="cc-name" :selected="item.id === courseInfo.id">{{ item.name }}</option>
          </select>
          <a v-if="courseInfo.url" :href="courseInfo.url" target="_blank">学习资源链接</a>
        </div>
      </article>
      <aside>
        <div class="study-log-outer">
          <div class="slo-title">
            <span>学习记录</span>
            <Tooltip content="记录规则：学习前点击【开始学习】按钮并在学习完成后点击【结束学习】按钮才会被记录">
              <img src="@/assets/icons/help-filling.png" width="15" height="15" class="help-icon" />
            </Tooltip>
            <span class="study-log-total">（共{{ studyLogTotal }}条）</span>
          </div>
          <div class="study-log-inner">
            <div class="sli-item" v-for="item in Object.keys(studyLog)" :key="item">
              <div class="sli-date">{{ item }}</div>
              <div class="sli-courses">
                <div class="sli-course-item" v-for="courseTitle in studyLog[item]" :key="courseTitle">
                  {{ courseTitle }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import Tooltip from '@/components/Tooltip';
import api from '@/api';
import { StudyLogManager } from './presenter'

const partNo = ref(null);
const chapterNo = ref(null);
const sectionNo = ref(null);
const isCustomer = ref(false);
const isStudying = ref(false);
const courseTitleMap = ref({});
const studyLog = ref({});
const courseInfo = ref({});
const studyLogTotal = ref(0);
const courseList = ref([]);
const hasPartInfo = ref(false);
const allTitle = ref('');
const showCustomerContentBtn = ref(true);
let partInfoListOfCurCourse;
let studyLogManager;

onMounted(() => {
  init();
  queryCourseList();
})

async function queryCourseList() {
  courseList.value = await api.getCourseList();
}

async function init() {
  const course = await api.getCurrentCourseInfo();
  const { partInfoList, titleMap, id } = course;
  courseInfo.value = course;
  partInfoListOfCurCourse = partInfoList;
  hasPartInfo.value = !!partInfoList.length; // 区分没有配置章节目录的课程
  courseTitleMap.value = titleMap;
  studyLogManager = new StudyLogManager(titleMap, id);
  updateStudyLogList();
}

async function updateStudyLogList() {
  const result = await studyLogManager.getStudyLogMap();
  studyLog.value = result.studyLog ?? {};
  studyLogTotal.value = result.total ?? 0;
}

function generatorRandom (max) {
  return Math.floor(Math.random(0, 1) * max) + 1;
}

function onRandom() {
  isCustomer.value = false;

  const currentPartNo = generatorRandom(partInfoListOfCurCourse.length); 
  partNo.value = currentPartNo;
  const currentPartItem = partInfoListOfCurCourse.find(item => item.id === currentPartNo);

  const curChapterNo = generatorRandom(currentPartItem.sectionNumPerChapterList.length);
  chapterNo.value = curChapterNo;

  const currentChapterNo = currentPartItem.sectionNumPerChapterList[curChapterNo - 1];
  sectionNo.value = generatorRandom(currentChapterNo);
}

function onEditCustomerCourse() {
  isCustomer.value = true;
  partNo.value = null;
  chapterNo.value = null;
  sectionNo.value = null;
}

function onEditCustomerContentCourse() {
  isCustomer.value = true;
  showCustomerContentBtn.value = false;
}

function onStartStudy() {
  isStudying.value = true;
  // changeDisable(true);
}

// function changeDisable(flag) {
//   const inputs = document.querySelectorAll('.numberInput');
//   Array.from(inputs).map((item) => item.disabled = flag);
// }

function onFinish() {
  if (!hasPartInfo.value) {
    if (!allTitle.value) {
      alert('请先补充学习内容名称');
    } else {
      updateStudyLog();
      showCustomerContentBtn.value = true;
    }
  } else {
    if (!courseTitleMap.value[`Part${partNo.value}`] || !courseTitleMap.value[`Part${partNo.value}.${chapterNo.value}`] || !courseTitleMap.value[`Part${partNo.value}.${chapterNo.value}.${sectionNo.value}`]) {
      alert('请先补充章节名称');
    } else {
      isStudying.value = false;
      updateStudyLog();
      // changeDisable(false);
      clearStates();
    }
  }
}

function clearStates() {
  partNo.value = null;
  isCustomer.value = false;
}

async function updateStudyLog() {
  const now = dayjs();
  const nowStamp = now.valueOf();
  const date = now.format('YYYY-MM-DD');
  const id = `${courseInfo.value.id}_${nowStamp}`;
  const studyLog = { date, id, courseId: courseInfo.value.id };
  if (hasPartInfo.value) {
    const titleKey = `Part${partNo.value}.${chapterNo.value}.${sectionNo.value}`;
    studyLog.titleKey = titleKey;
  } else {
    studyLog.allTitle = allTitle.value;
  }
  await api.addStudyLog(studyLog);
  updateStudyLogList();
}

function updateCourseTitleMap(event, key) {
  if (!event.target.value) return;
  courseTitleMap.value[key] = event.target.value;
  api.updateCourseTitleMapById(courseInfo.value.id, key,  event.target.value);
}

async function onCourseChange(event) {
  await api.updateConfig('currentCourseId', +event.target.value);
  init();
  clearStates();
}

</script>

<style>
.title {
  font-size: 110px;
  font-weight: bolder;
  font-family: cursive;
  margin-top: 20px;
}
.main {
  display: flex;
  min-height: 700px;
  overflow: hidden;
}
article {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 25px;
}
aside {
  flex-basis: 400px;
  border-left: 1px dotted rgba(0, 123, 255, 0.595);
  height: calc(100vh - 55px);
}
.random-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
}
.random-info-box {
  margin-bottom: 60px;
}
.random-info-item {
  display: flex;
  margin-bottom: 50px;
  font-size: 35px;
  font-weight: bolder;
}
.rii-des {
  display: flex;
  align-items: center;
}
.textarea {
  height: 50px;
  width: 500px;
}
.customer-content {
  margin-bottom: 100px;
}
input {
  width: 300px;
  height: 35px;
  margin-left: 5px;
  font-size: 20px;
  margin-top: 5px;
}
.rii-title {
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 20px;
}
.rii-title input {
  width: 40px;
  height: 35px;
  font-size: 20px;
  margin-top: 0;
}
.btn-box {
  display: flex;
}
.startBtn {
  width: 180px;
  height: 50px;
  font-size: 18px;
  border-radius: 20px;
}
.startBtn:nth-child(odd) {
  margin-left: 10px;
  margin-right: 10px;
}
.study-log-outer {
  margin: 15px;
}
.study-log-inner {
  overflow: scroll;
  height: calc(100vh - 110px);
  padding-top: 15px;
}
.slo-title {
  display: flex;
  position: relative;
  color: #666666;
  font-weight: bolder;
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
}
.study-log-total {
  position: absolute;
  right: 0;
  bottom: 12px;
  font-size: 12px;
}
.sli-date {
  font-size: 17px;
  color: cadetblue;
}
.sli-courses {
  margin-top: 8px;
}
.sli-course-item {
  margin-left: 25px;
  border: 1px solid gray;
  padding: 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 10px;
}
.current-course {
  display: flex;
  margin-bottom: 20px;
}
.change-course {
  width: 200px;
  margin-right: 10px;
  font-size: 18px;
}
.cc-title {
  display: flex;
}
.cct-text {
  margin-right: -3px;
}
.link-text {
  cursor: pointer;
}
.help-icon {
  margin-left: 5px;
  cursor: pointer;
  align-self: center;
}
</style>