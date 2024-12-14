<template>
  <div id="contextMenu" class="context-menu" style="display: none">
    <ul class="menu">
      <li v-for="item in menu" :key="item.name">
        <el-button
          @click="() => onMenuItemClick(item)"
          text
          :type="item.type"
          :disabled="item.disabled ? item.disabled(currentTargetEle) : false"
          >{{ item.name }}</el-button
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, defineExpose, ref, defineProps } from "vue";
import { TargetClassNameMap } from './config';

const props = defineProps({
  menuDataMap: Object,
});

const showMenu = ref(false);
const currentTargetEle = ref(null);
const menu = ref([]);

onMounted(() => {
  document.onclick = hideMenu;
  document.oncontextmenu = onContextMenu;
});

function hideMenu() {
  if (document.getElementById("contextMenu")) {
    document.getElementById("contextMenu").style.display = "none";
  }
  showMenu.value = false;
}

function rightClick(e, options = {}) {
  const { topOffset = -78, leftOffset = -20 } = options;
  e.preventDefault();
  if (document.getElementById("contextMenu").style.display == "block") {
    hideMenu();
  } else {
    var menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    showMenu.value = true;
    menu.style.left = e.pageX + leftOffset + "px";
    menu.style.top = e.pageY + topOffset + "px";
  }
}

function onMenuItemClick(item) {
  const { onClick } = item;
  onClick(currentTargetEle.value);
}

function onContextMenu(e) {
  if (!props.menuDataMap) {
    return null;
  }
  
  const className = e.target.className;
  // console.log(className, e);

  const handler = (className) => {
    menu.value = props.menuDataMap[className];
    currentTargetEle.value = e.target;
    rightClick(e);
  }

  // 日历事件右键
  if (className.indexOf(TargetClassNameMap.Event) !== -1) {
    handler(TargetClassNameMap.Event);
  }

  // 日历格子右键
  if (className.indexOf(TargetClassNameMap.DayContainer) !== -1) {
    handler(TargetClassNameMap.DayContainer);
  }

  return null;
}

defineExpose({
  hideMenu,
  showMenu,
});
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
}

.context-menu {
  position: absolute;
  z-index: 10000;
  background-color: #fff;
  min-width: 120px;
}

.menu {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgb(64 64 64 / 5%);
  padding: 10px 0;
}

.menu > li {
  font: inherit;
  border: 0;
  display: flex;
  align-items: center;
  position: relative;
  text-decoration: unset;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  font-size: 12px;
  transition: 0.5s linear;
  -webkit-transition: 0.5s linear;
  -moz-transition: 0.5s linear;
  -ms-transition: 0.5s linear;
  -o-transition: 0.5s linear;

  ::v-deep(.el-button) {
    width: 100%;
  }
}
</style>
