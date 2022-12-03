<script setup lang="ts">
import { pocketBaseSymbol } from "@/symbols/injectionSymbols";
import { inject, onMounted, onUnmounted, ref } from "vue";
import IndividualPostComponent from "../components/IndividualPostComponent.vue";

// Inject the PocketBase client
const $pb = inject(pocketBaseSymbol);

// Local reactive variables
const posts = ref<any[]>([]);

// Get all the user's posts
const getPostList = async () => {
  try {
    const list = await $pb?.collection("posts").getFullList(200, {
      expand: "user",
    });
    if (list) {
      posts.value = list;
    }
  } catch (error) {
    console.log(error);
  }
};

// Subcribe to the posts collection
const subscribeToAllPosts = async () => {
  await $pb?.realtime.subscribe("posts", async function (e) {
    await getPostList();
  });
};

// Unsubscribe fromt he posts collection
const unsubscribeToAllPosts = async () => {
  await $pb?.realtime.unsubscribe("posts");
};

onMounted(async () => {
  await getPostList();
  await subscribeToAllPosts();
});

onUnmounted(async () => {
  await unsubscribeToAllPosts();
});
</script>

<template>
  <h1 class="mb-3 text-2xl">Feed</h1>
  <v-carousel cycle show-arrows="hover">
    <v-carousel-item v-for="(post, i) in posts" :key="i">
      <v-sheet height="100%" tile>
        <IndividualPostComponent :post-data="post" />
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
