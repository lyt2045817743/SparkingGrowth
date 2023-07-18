<template>
    <div class="main">
      <article>
        <div class="title">今天学什么？</div>
        <div class="random-box">
          <div v-if="partNo" class="random-info-box">
            <div class="random-info-item">
              <div class="rii-title">
                第{{ partNo }}部分-
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}`]" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}`)" />
              </div>
            </div>
            <div class="random-info-item">
              <div class="rii-title">
                第{{ chapterNo }}章-
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}.${chapterNo}`]" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}.${chapterNo}`)" />
              </div>  
            </div>
            <div class="random-info-item">
              <div class="rii-title">
                第{{ sectionNo }}节-
              </div>
              <div class="rii-des">
                <input v-model="courseTitleMap[`Part${partNo}.${chapterNo}.${sectionNo}`]" @blur="(value) => updateCourseTitleMap(value, `Part${partNo}.${chapterNo}.${sectionNo}`)" />
              </div>
            </div>
          </div>
          <button id="startBtn" @click="onStart">开始随机生成课表</button>
        </div>
      </article>
      <aside></aside>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { PartArr } from '../../data/javascriptInfo';

const partNo = ref(null);
const chapterNo = ref(null);
const sectionNo = ref(null);
const courseTitleMap = localStorage.getItem('courseTitleMap') ? JSON.parse(localStorage.getItem('courseTitleMap')) : {};

function generatorRandom (max) {
  return Math.floor(Math.random(0, 1) * max) + 1;
}

function onStart() {
  const currentPartNo = generatorRandom(PartArr.length); 
  partNo.value = currentPartNo;
  const currentPartItem = PartArr.find(item => item.id === currentPartNo);

  const curChapterNo = generatorRandom(currentPartItem.grandsonNumArr.length);
  chapterNo.value = curChapterNo;

  const currentChapterNo = currentPartItem.grandsonNumArr[curChapterNo - 1];
  sectionNo.value = generatorRandom(currentChapterNo);
}

function updateCourseTitleMap(event, key) {
  courseTitleMap[key] = event.target.value;
  localStorage.setItem('courseTitleMap', JSON.stringify(courseTitleMap));
}

</script>

<style>
.title {
  font-size: 110px;
  font-weight: bolder;
}
.main {
  display: flex;
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
  border: none;
  font-size: 20px;
  margin-top: 5px;
}
#startBtn {
  width: 180px;
  height: 50px;
  font-size: 18px;
  border-radius: 20px;
}
</style>