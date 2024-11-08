<template>
  <v-app>
    <Menu />
    <v-container>
      <h1>商品列表</h1>

      <!-- 搜尋框 -->
      <v-text-field
          v-model="searchQuery"
          label="搜尋商品"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
          @input="filterProducts"
      />

      <!-- 商品列表 -->
      <v-row>
        <v-col
            v-for="product in paginatedProducts"
            :key="product.tktNo"
            cols="12"
            sm="6"
            md="4"
        >
          <v-card>
            <v-img :src="'data:image/jpeg;base64,' + product.imagesBase64[0]" height="200px" />
            <v-card-title>{{ product.tktName }}</v-card-title>
            <v-card-subtitle>${{ product.price }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="primary" @click="addToCart(product)">
                加入購物車
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- 分頁 -->
      <v-pagination
          v-model="currentPage"
          :length="pageCount"
          class="mt-4"
          @input="updatePage"
      ></v-pagination>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Menu from '~/components/front/Menu.vue';
import {parseJwt} from "~/utils/jwt.js";
import axios from 'axios';


const items = ref([]); // 用於存儲 API 獲取的商品數據
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(6); // 每頁顯示的商品數量

// 用於計算總頁數
const pageCount = ref(1);

const accessToken = useCookie('member_access_token').value
const userInfo = accessToken ? parseJwt(accessToken) : null
const memNo = userInfo?.memNo;

// API 調用函數，根據當前頁碼獲取商品數據
async function fetchProducts(page = 1) {
  try {
    const res = await axios.get('http://localhost:8080/ticket/all', {
      params: {
        page: page - 1,
        size: itemsPerPage.value,
      },
    });
    items.value = res.data.content; // 設置商品數據
    pageCount.value = res.data.totalPages; // 更新總頁數
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// 當組件加載時獲取數據
onMounted(() => {
  fetchProducts(currentPage.value);
});

// 當頁碼變更時調用 fetchProducts 以獲取對應頁碼的數據
watch(currentPage, (newPage) => {
  fetchProducts(newPage);
});

// 根據搜索關鍵詞篩選商品
const filteredProducts = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((product) =>
      product.tktName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 根據篩選後的結果進行分頁
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

// 搜尋功能
function filterProducts() {
  currentPage.value = 1; // 搜尋時重置為第一頁
}

// 加入購物車功能
async function  addToCart(product) {
  alert(`已將 ${product.tktName} 加入購物車`);
  try {
    const res = await axios.post(`http://localhost:8080/cart/addToCart?memNo=${memNo}`,{
      tktNo: product.tktNo,
      count: 1,
      tktName: product.tktName,
      price: product.price,
    });
    // console.log(res.data)
  } catch (error) {
    console.error('Error fetching addToCart:', error);
  }
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
