<script setup lang="ts">
const props = defineProps({
  postData: Object,
});
</script>

<template>
  <v-card class="pa-md-4 mx-lg-auto" color="secondary" max-width="344">
    <v-card-text>
      <div>{{ props.postData?.title }}</div>
      <div class="text--primary">
        {{ props.postData?.content }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="text" color="deep-purple-accent-4">
        {{ props.postData?.expand.user.username }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
