<script setup>
import {ref} from 'vue';

const appTitle = ref('Memory');
const sidebar = ref(false);
const menuItems = [
  {title: '商品', path: '/productList', icon: ''},
  {title: '購物車', path: '/cart', icon: 'mdi-cart'},
  {title: '會員專區', path: '/member', icon: 'mdi-account'},
];
</script>

<template>
  <v-app-bar app>
    <v-toolbar-title>
      <router-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </router-link>
    </v-toolbar-title>

    <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        variant="text">
      <v-icon left>{{ item.icon }}</v-icon>
      {{ item.title }}
    </v-btn>
  </v-app-bar>
</template>

<style>
/* Add your styles here */
</style>
