<template>
  <div class="about">
    <h1>{{ dates }} This is an about page</h1>
    <EasePick
      @change="logDates()"
      v-model="dates"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import EasePick from "@/components/EasePick.vue";
const dates = ref("");
function logDates() {
  console.log(dates);
}
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
