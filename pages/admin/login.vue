<template>
  <h1>後台登入</h1>
    <v-sheet class="mx-auto" width="300">
      <v-form fast-fail @submit.prevent="login">
        <v-text-field
          v-model="userName"
          :rules="userName"
          label="帳號"
        ></v-text-field>
  
        <v-text-field
          v-model="password"
          :rules="password"
          label="密碼"
        ></v-text-field>
  
        <v-btn class="mt-2" type="submit" block>登入</v-btn>
      </v-form>
    </v-sheet>
  </template>
<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useCookie } from '#app';  // 使用 Nuxt 3 提供的 useCookie

// 定義狀態
const userName = ref('');
const password = ref('');

// 登入邏輯
const login = async () => {
  try {
    const response = await axios.post('http://localhost:8081/auth/emp', {
      userName: userName.value,
      password: password.value
    }, {
      withCredentials: true // 確保將 Cookie 自動存儲到瀏覽器
    });

    // 成功登錄後跳轉到 /admin/dashboard
    navigateTo('/admin/dashbord');
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>