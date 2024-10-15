<template>
    <v-container class="pa-md-12">
      <section>
        <h3 class="d-flex justify-space-between align-center text-subtitle-1 font-weight-bold">
          商品列表
  
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            slim
            text="新增商品"
            variant="flat"
          />
        </h3>
  
        <!-- <v-data-table
          class="bg-transparent"
          :headers="headers"
          hide-default-footer
          :items="items"
        >
          <template #item.actions>
            <v-btn
              class="text-none"
              color="secondary"
              min-width="0"
              slim
              text="編輯"
              variant="flat"
            />
          </template>
        </v-data-table> -->
        <!-- v-data-table: 加載後端返回的數據 -->
      <v-data-table
        class="bg-transparent"
        :headers="headers"
        :items="items"              
        :items-per-page="itemsPerPage" 
        :page.sync="currentPage"     
        :server-items-length="totalItems"
        @update:page="onPageChange"   
        @update:items-per-page="onItemsPerPageChange" 
      >
        <template #item.actions="{ item }">
          <!-- 編輯按鈕，點擊時跳轉到編輯頁面 -->
          <v-btn class="text-none" color="primary" min-width="0" slim @click="goToEditPage(item.id)">
            編輯
          </v-btn>
        </template>
      </v-data-table>

      <!-- 分頁控件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"   
        @input="onPageChange" 
      ></v-pagination>
      </section>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const headers = [
    {
      title: '編號',
      key: 'tktNo',
    },
    {
      title: '商品名稱',
      key: 'tktName',
    },
    {
      title: '庫存數量',
      key: 'originalAmount',
    },
    {
      title: '價格',
      key: 'price',
    },
    {
      title: '售出數量',
      key: 'soldAmount',
    },
    {
        title: '',
        key: 'actions',
    }
  ]
  
    // const items = ref([])  
    // const errorMsg = ref('')
    
    // // 在組件掛載時發送 API 請求
    // onMounted(async () => {
    //     try {
    //     const response = await axios.get('http://localhost:8080/ticket/all')
    //     items.value = response.data.map(item => ({
    //         tktNo: item.tktNo,
    //         tktName: item.tktName,
    //         originalAmount: item.originalAmount,
    //         price: item.price, 
    //         soldAmount: item.soldAmount
    //     }))
    //     } catch (error) {
    //     errorMsg.value = '無法取得優惠列表：' + error.message
    //     }
    // })

const items = ref([])          // 當前頁的商品列表
const totalItems = ref(0)      // 總商品數量
const totalPages = ref(1)      // 總頁數
const currentPage = ref(1)     // 當前頁碼
const itemsPerPage = ref(5)   // 每頁顯示的商品數

// 請求商品列表數據（帶有分頁）
const fetchProducts = async (page = 1) => {
    console.log(`Fetching products for page: ${page}, itemsPerPage: ${itemsPerPage.value}`)
  try {
    const res = await axios.get(`http://localhost:8080/ticket/all`, {
      params: {
        page: page - 1,  // Spring Boot 的頁數從 0 開始
        size: itemsPerPage.value
      }
    })
    console.log('Received data for page:', page, res.data); // 檢查後端返回的數據
    // 更新前端數據
    items.value = res.data.content            // 當前頁的商品列表
    console.log('value: ' , items.value);
    
    totalItems.value = res.data.totalElements // 總商品數量
    totalPages.value = res.data.totalPages    // 總頁數
  } catch (error) {
    console.error('無法獲取商品列表', error)
  }
}

// 當頁碼變化時
const onPageChange = (page) => {
    console.log('Page changed to:', page);  
    console.log('current page: ' ,  currentPage.value);
    if (currentPage != null || currentPage != '' || currentPage != undefined) {
        page = currentPage.value;
    }
    
  fetchProducts(page)
}

// 當每頁顯示數量變化時，請求新數據
const onItemsPerPageChange = (newItemsPerPage) => {
    console.log('Items per page changed to:', newItemsPerPage);
  itemsPerPage.value = newItemsPerPage
  console.log('newItemsPerPage:' + newItemsPerPage);
  
  fetchProducts(currentPage.value) // 重新載入當前頁面的數據
}

onMounted(() => {
  // 頁面加載時加載第一頁數據
  fetchProducts(currentPage.value)
})
  </script>
  