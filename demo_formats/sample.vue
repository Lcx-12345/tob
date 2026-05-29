<template>
  <div class="app">
    <h1>工具演示 - Vue格式</h1>
    <div v-for="tool in tools" :key="tool.name" class="tool-card">
      <h3>{{ tool.name }}</h3>
      <span class="category">{{ tool.category }}</span>
      <p>{{ tool.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const tools = ref([
  { name: "Write", category: "文件操作", description: "写入文件到本地文件系统" },
  { name: "Read", category: "文件操作", description: "读取本地文件" },
  { name: "RunCommand", category: "命令执行", description: "执行终端命令" },
]);
</script>

<style scoped>
.tool-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
}
</style>
