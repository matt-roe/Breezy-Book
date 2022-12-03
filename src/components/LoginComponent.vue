<template>
  <v-expansion-panels v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>Login</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" @submit.prevent="authUser">
          <!-- :rules="emailRules" -->
          <v-text-field v-model="email" label="E-mail" required></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
          ></v-text-field>
          <v-btn color="success" class="mr-4" @click="authUser"> Login </v-btn>
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { pocketBaseSymbol } from "@/symbols/injectionSymbols";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

// Inject the PocketBase client
const $pb = inject(pocketBaseSymbol);

// Init the store
const userStore = useUserStore();

// Router composable
const router = useRouter();

var panel = ref(0);

// Local reactive variables
const email = ref("");
const password = ref("");

// Function to authenticate the user based on email and password
const authUser = async () => {
  try {
    // Authenticate the user via email and password
    const userData = await $pb
      ?.collection("users")
      .authWithPassword(email.value, password.value);

    if (userData) {
      userStore.userID = userData.record.id;
      userStore.username = userData.record.profile?.username;
      userStore.userProfileID = userData.record.profile?.id!;
      router.push({ path: "/dashboard" });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
