<template>
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
const router = useRouter();
const tokenCookie = useCookie('jwt_token');  // 定義一個名為 jwt_token 的 Cookie

// 登入邏輯
const login = async () => {
  try {
    const response = await axios.post('http://localhost:8080/auth/authenticate', {
      userName: userName.value,
      password: password.value
    });

    // 從響應中獲取 JWT Token
    const token = response.data.jwt

    tokenCookie.value = token
    // 成功登錄後跳轉到 /admin/dashboard
    router.push('/admin/dashbord');
  } catch (error) {
    console.error("Login failed:", error);
    router.push('/admin/login');
  }
};
</script>