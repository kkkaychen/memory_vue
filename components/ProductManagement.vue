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

      <v-alert
        v-if="errMsg"
        dense
        text
        type="success"
      >{{ errMsg }}</v-alert>

      <v-alert
        v-if="successMsg"
        dense
        text
        type="success"
      >{{ successMsg }}</v-alert>

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
                    <v-text-field label="地區" v-model="editData.locate"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="開始時間" v-model="editData.tktStartDate"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="結束時間" v-model="editData.tktEndDate"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="詳細說明" v-model="editData.instruction"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="地址" v-model="editData.address"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="注意事項" v-model="editData.notice"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="使用說明" v-model="editData.howUse"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="政策說明" v-model="editData.canxpolicy"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="狀態" type="number" v-model="editData.tktStatus"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="售出數量" type="number" v-model="editData.soldAmount" disabled></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="種類" type="number" v-model="editData.kind"></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>
                <v-btn color="primary" text="保存" variant="tonal" @click="saveChanges(item.tktNo)"></v-btn>
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
const errMsg = ref('')
const successMsg = ref('')

const dialog = ref(false)
const editData = ref({
  tktName: '',
  originalAmount: 0,
  price: 0,
  tktStartDate: '',
  tktEndDate: '',
  locate: '',
  instruction: '',
  address: '',
  notice: '',
  howUse: '',
  canxpolicy: '',
  tktStatus: 0,
  soldAmount: 0,
  kind: 0
})

// 抓取商品列表
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
    errMsg.value = error
    setTimeout(() => {
      errMsg.value = ''
    }, 2000)
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

const saveChanges = async (id) => {
  try {
    const res = await axios.patch(`http://localhost:8080/ticket/${editData.value.tktNo}/update`, editData.value)
    dialog.value = false
    successMsg.value = '商品修改儲存成功'
    setTimeout(() => {
      successMsg.value = ''
    }, 2000)
  } catch (error) {
    console.error('無法修改商品資訊', error)
    errMsg.value = error
    setTimeout(() => {
      errMsg.value = ''
    }, 2000)
  }
}


</script>
