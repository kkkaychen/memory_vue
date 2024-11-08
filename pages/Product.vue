<template>
  <v-app>
    <Menu/>
    <v-container>
      <v-row class="justify-center">
        <!-- 商品卡片 -->
        <v-col cols="12" md="8" lg="6">
          <v-card>
            <!-- 商品圖片 -->
            <v-img :src="product.image" height="400px"></v-img>

            <!-- 商品信息 -->
            <v-card-title>{{ product.name }}</v-card-title>
            <v-card-subtitle>價格：${{ product.price }}</v-card-subtitle>
            <v-card-text>
              <p>{{ product.description }}</p>
            </v-card-text>

            <!-- 加入購物車按鈕 -->
            <v-card-actions>
              <v-btn color="primary" @click="addToCart">
                加入購物車
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import Menu from "~/components/front/Menu.vue";

// 假設從 API 或路由參數中獲取的商品數據
const product = ref({
  id: 1,
  name: '高品質藍牙耳機',
  price: 299,
  image: 'https://via.placeholder.com/400',
  description: '這是一款高品質的無線藍牙耳機，擁有出色的音質和長效電池。',
});

function addToCart() {
  alert(`已將 ${product.value.name} 加入購物車`);
}
</script>

<style scoped>
/* 設置適當的間距 */
.v-container {
  padding-top: 20px;
}
</style>