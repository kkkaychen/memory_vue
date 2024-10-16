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

      <v-data-table
        class="bg-transparent"
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        hide-default-footer
      >
        <template #item.actions="{ item }">
          <v-dialog v-model="dialog" max-width="600">
            <template #activator="{ on, attrs }">
              <!-- 確保 v-bind 和 v-on 傳遞有效值 -->
              <v-btn class="text-none" color="secondary" min-width="0" slim v-bind="attrs || {}" v-on="on || {}" @click="goToEditPage(item.tktNo)">
                編輯
              </v-btn>
            </template>

            <!-- Dialog 內容 -->
            <v-card prepend-icon="mdi-account" title="編輯商品">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field label="商品名稱" v-model="editData.tktName"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="庫存數量" type="number" v-model="editData.originalAmount"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="價格" type="number" v-model="editData.price"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="售出數量" type="number" v-model="editData.soldAmount" disabled></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
                <v-btn color="primary" text="保存" variant="tonal" @click="saveChanges(item.id)"></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>

      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @update:modelValue="onPageChange"
      ></v-pagination>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const headers = [
  { title: '編號', key: 'tktNo' },
  { title: '商品名稱', key: 'tktName' },
  { title: '庫存數量', key: 'originalAmount' },
  { title: '價格', key: 'price' },
  { title: '售出數量', key: 'soldAmount' },
  { title: '', key: 'actions' }
]

const items = ref([])
const totalItems = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const itemsPerPage = ref(5)

const dialog = ref(false)
const editData = ref({
  tktName: '',
  originalAmount: 0,
  price: 0,
  soldAmount: 0
})

const fetchProducts = async (page = 1) => {
  try {
    const res = await axios.get('http://localhost:8080/ticket/all', {
      params: {
        page: page - 1,
        size: itemsPerPage.value
      }
    })
    items.value = res.data.content
    totalItems.value = res.data.totalElements
    totalPages.value = res.data.totalPages
  } catch (error) {
    console.error('無法獲取商品列表', error)
  }
}

const onPageChange = (newPage) => {
  fetchProducts(newPage)
}

onMounted(() => {
  fetchProducts(currentPage.value)
})

// 點擊編輯按鈕時，載入商品資訊
const goToEditPage = (id) => {
  const product = items.value.find(item => item.tktNo === id)
  
  if (product) {
    editData.value = { ...product }
    dialog.value = true
  }
}

// 保存編輯後的更改
const saveChanges = (id) => {
  console.log('保存的商品數據：', editData.value)
  dialog.value = false
}
</script>
