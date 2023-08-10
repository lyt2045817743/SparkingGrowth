<template>
    <div class="main">
      <article>
        <div class="title">今天学什么？</div>
        <div class="random-box">
          <div v-if="partNo || isCustomer" class="random-info-box">
            <div class="random-info-item">
              <div class="rii-title">
                第
                <input v-if="isCustomer" type="number" v-model="partNo" />
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
                <input v-if="isCustomer" type="number" v-model="chapterNo" />
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
                <input v-if="isCustomer" type="number" v-model="sectionNo" />
                <span v-else>{{ sectionNo }}</span>
                节
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}.${chapterNo}.${sectionNo}`]" placeholder="请补充本节名称" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}.${chapterNo}.${sectionNo}`)" />
              </div>
            </div>
          </div>
          <div class="btn-box">
            <button v-if="!isStudying" class="startBtn" @click="onRandom">开始生成随机章节</button>
            <button v-if="!isStudying" class="startBtn" @click="onEditCustomerCourse">学习自定义章节</button>
            <button v-if="allTitle && !isStudying" class="startBtn" @click="onStartStudy">开始学习</button>
            <button v-if="isStudying" class="startBtn finishStudyBtn" @click="onFinish">完成学习</button>
          </div>
        </div>
        <div class="current-course">
          <span class="cc-title">当前课程：</span>
          <a v-if="courseInfo.url" :href="courseInfo.url" target="_blank">{{ courseInfo.name }}</a>
          <span v-else class="cc-name">{{ courseInfo.name }}</span>
          <span class="change-course-link link-text" @click="changeCourse">切换课程</span>
        </div>
      </article>
      <aside>
        <div class="study-log-outer">
          <div class="slo-title">
            <span>学习记录</span>
            <Tooltip content="记录规则：学习前点击【开始学习】按钮并在学习完成后点击【结束学习】按钮才会被记录">
              <img src="@/assets/icons/help-filling.png" width="15" height="15" class="help-icon" />
            </Tooltip>
          </div>
          <div class="study-log-inner">
            <div class="sli-item" v-for="item in Object.keys(studyLog)" :key="item">
              <div class="sli-date">{{ item }}</div>
              <div class="sli-courses">
                <div class="sli-course-item" v-for="course in studyLog[item].courseList" :key="course">
                  {{ course.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import Tooltip from '@/components/Tooltip';
import { getCurrentCourseInfo } from './server'

const partNo = ref(null);
const chapterNo = ref(null);
const sectionNo = ref(null);
const isCustomer = ref(false);
const isStudying = ref(false);
const courseTitleMap = localStorage.getItem('courseTitleMap') ? reactive(JSON.parse(localStorage.getItem('courseTitleMap'))) : reactive({});
const studyLog = localStorage.getItem('studyLog') ? reactive(JSON.parse(localStorage.getItem('studyLog'))) : reactive({});
const courseInfo = ref({});
let partInfoList;

onMounted(() => {
  init();
})

async function init() {
  courseInfo.value = await getCurrentCourseInfo();
  partInfoList = courseInfo.value.partInfoList;
}

function generatorRandom (max) {
  return Math.floor(Math.random(0, 1) * max) + 1;
}

function onRandom() {
  const currentPartNo = generatorRandom(partInfoList.length); 
  partNo.value = currentPartNo;
  const currentPartItem = partInfoList.find(item => item.id === currentPartNo);

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

function onStartStudy() {
  isStudying.value = true;
  changeDisable(true);
}

const allTitle = computed(() => {
  const thirdTitleKey = `Part${partNo.value}.${chapterNo.value}.${sectionNo.value}`;
  const thirdTitle = courseTitleMap[thirdTitleKey];

  const secondTitleKey = `Part${partNo.value}.${chapterNo.value}`;
  const secondTitle = courseTitleMap[secondTitleKey];

  const firstTitleKey = `Part${partNo.value}`;
  const firstTitle = courseTitleMap[firstTitleKey];

  return thirdTitle && secondTitle && firstTitle ? `${thirdTitleKey}：【${firstTitle}】.【${secondTitle}】.【${thirdTitle}】` : '';
})

function changeDisable(flag) {
  const inputs = document.querySelectorAll('input');
  Array.from(inputs).map((item) => item.disabled = flag);
}

function onFinish() {
  isStudying.value = false;
  changeDisable(false);
  updateStudyLog();
}

function updateStudyLog() {
  if (!courseTitleMap[`Part${partNo.value}`] || !courseTitleMap[`Part${partNo.value}.${chapterNo.value}`] || !courseTitleMap[`Part${partNo.value}.${chapterNo.value}.${sectionNo.value}`]) {
    alert('请先输入章节名称');
  } else {
    const todayStr = dayjs().format('YYYY-MM-DD');
    const courseItem = {
      title: allTitle.value,
    }
    if (!studyLog[todayStr]) {
      studyLog[todayStr] = {};
      studyLog[todayStr].courseList = [courseItem];
    } else {
      if (!studyLog[todayStr].courseList) {
        studyLog[todayStr].courseList = [];
      }
      studyLog[todayStr].courseList.push(courseItem);
    }
    localStorage.setItem('studyLog', JSON.stringify(studyLog));
  }
}

function updateCourseTitleMap(event, key) {
  courseTitleMap[key] = event.target.value;
  localStorage.setItem('courseTitleMap', JSON.stringify(courseTitleMap));
}

function changeCourse() {
  alert('即将开放，敬请期待');
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
  color: #666666;
  font-weight: bolder;
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
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
  margin-bottom: 20px;
}
.change-course-link {
  margin-left: 10px;
  color: blue;
  font-size: 10px;
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