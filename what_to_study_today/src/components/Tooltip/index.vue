<template>
  <div class="tooltip-outer" @mouseover="showText = true" @mouseleave="showText = false">
    <p v-if="showText" :class="['tooltip', getClassName()]">{{ content }}</p>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
const showText = ref(false);

const props = defineProps({
  content: String,
  triggerType: String,
  placement: String,
});

function getClassName() {
  return 'tooltip-' + props.placement;
}
</script>

<style scoped>
.tooltip-outer {
  position: relative;
  display: flex;
}
.tooltip {
  position: absolute;
  font-size: 10px;
  color: white;
  background-color: #303133;
  border-radius: 5px;
  padding: 2px 5px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.9;
  z-index: 999;
  white-space: nowrap;
}

.tooltip-top {
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-right {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
}
</style>