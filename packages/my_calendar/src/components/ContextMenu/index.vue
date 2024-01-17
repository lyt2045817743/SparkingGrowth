<template>
  <div id="contextMenu" class="context-menu" style="display: none"> 
    <ul class="menu"> 
      <li v-for="item in menuData" @click="item.onClick" :key="item.name" :class="item.type ?? ''">{{ item.name }}</li>
    </ul> 
  </div>
</template>

<script lang="ts" setup>
import { onMounted, defineExpose, ref, defineProps } from 'vue';
defineProps({
  menuData: Object
})

const showMenu = ref(false);

onMounted(() => {
  document.onclick = hideMenu;
})

function hideMenu() { 
  document.getElementById("contextMenu").style.display = "none" 
  showMenu.value = false;
}

function rightClick(e, { topOffset }) {
  e.preventDefault();
  if (document.getElementById("contextMenu").style.display == "block"){ 
    hideMenu();
  }else{
    var menu = document.getElementById("contextMenu");    
    menu.style.display = 'block'; 
    showMenu.value = true;
    menu.style.left = e.pageX + "px"; 
    menu.style.top = e.pageY + topOffset + "px"; 
  } 
} 

defineExpose({
  rightClick,
  hideMenu,
  showMenu
})
</script>

<style lang="scss" scoped>
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
  padding: 10px 30px 10px 15px;
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

  &:hover {
    background:#f1f3f7;
    color: #4b00ff;
  }
}
.menu > li.trash:hover {
  color: red;
}
</style>
