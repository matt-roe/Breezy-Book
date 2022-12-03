<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>Register</v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-form ref="form" @submit.prevent="createUser">
          <v-text-field
            v-model="username"
            label="Username"
            required
          ></v-text-field>
          <!-- :rules="emailRules" -->
          <v-text-field
            v-model="email"
            type="email"
            label="E-mail"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            required
          ></v-text-field>
          <v-text-field
            v-model="passwordConfirm"
            type="password"
            label="Confirm Password"
            required
          ></v-text-field>
          <v-btn color="success" class="mr-4" @click="createUser"
            >Register</v-btn
          >
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import { pocketBaseSymbol } from "@/symbols/injectionSymbols";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

// Inject the PocketBase client
const $pb = inject(pocketBaseSymbol);

// Init the store
const userStore = useUserStore();

// Router composable
const router = useRouter();

// Reactive variables
const email = ref("");
const username = ref("");
const password = ref("");
const passwordConfirm = ref("");

// Function to create a new user
const createUser = async () => {
  try {
    if (validateInput()) {
      // Create new user
      const user = await $pb?.collection("users").create({
        username: username.value,
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      });
      if (user) {
        // Authenticate the user in order to set the username
        await authUser();

        // After succesfull user registration, redirect to dashboard
        router.push({ path: "/dashboard" });
      } else {
        console.log("Error");
      }
    } else {
      alert("Password doesn't match");
    }
  } catch (error) {
    console.log(error);
  }
};

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

// Simple utility function to validate input. Easiliy extendable with additional checks if needed
const validateInput = () => {
  if (password.value !== passwordConfirm.value) {
    return false;
  } else {
    return true;
  }
};
</script>
