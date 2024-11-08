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
          @click="openNewProductDialog"
        />
      </h3>
      

      <v-alert
        v-if="errMsg"
        border="start"
        close-label="Close Alert"
        variant="tonal"
        closable
        type="error"
      >{{ errMsg }}</v-alert>

      <v-alert
        v-if="successMsg"
        border="start"
        close-label="Close Alert"
        variant="tonal"
        closable
        type="success"
      >{{ successMsg }}</v-alert>

      <!-- 新增商品的對話框 -->
      <v-dialog v-model="newProductDialog" max-width="600">
        <v-form ref="productForm" v-model="formValid">
          <v-card>
            <v-card-title>新增商品</v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field label="商品名稱" v-model="newProductData.tktName" :rules="[requiredRule]" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="庫存數量" type="number" v-model="newProductData.originalAmount" :rules="[requiredRule, positiveNumberRule]" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="價格" type="number" v-model="newProductData.price" :rules="[requiredRule, positiveNumberRule]" required></v-text-field>
                </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="地區" v-model="newProductData.locate" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="開始時間" v-model="newProductData.tktStartDate" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="結束時間" v-model="newProductData.tktEndDate" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="詳細說明" v-model="newProductData.instruction" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="地址" v-model="newProductData.address" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="注意事項" v-model="newProductData.notice" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="使用說明" v-model="newProductData.howUse" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="政策說明" v-model="newProductData.canxpolicy" :rules="[requiredRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="狀態" type="number" v-model="newProductData.tktStatus" :rules="[requiredRule, positiveNumberRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="售出數量" type="number" v-model="newProductData.soldAmount" disabled :rules="[requiredRule, positiveNumberRule]" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field label="種類" type="number" v-model="newProductData.kind" :rules="[requiredRule, positiveNumberRule]" required></v-text-field>
                    </v-col>
              </v-row>
            </v-card-text>

            <v-col cols="12" md="6">
              <v-file-input
                label="File input"
                prepend-icon="mdi-camera"
                show-size
                multiple
                small-chips
                @change="handleFileChange"
              ></v-file-input>
            </v-col>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="newProductDialog = false">取消</v-btn>
              <v-btn color="primary" @click="submitForm">保存</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <v-data-table
        class="bg-transparent"
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        hide-default-footer
      >
        <template #item.actions="{ item }">
          <v-dialog v-model="dialog" max-width="800">
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

                  <!-- 在這裡加入圖片顯示部分 -->
                  <v-col cols="12">
                    <h3>商品圖片</h3>
                    <div v-for="(image, index) in editData.imagesBase64" :key="index">
                      <img :src="'data:image/jpeg;base64,' + image" alt="商品圖片" style="max-width: 100%; margin-bottom: 10px;" />
                    </div>
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

const emptyProduct = () => ({
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
  kind: 0,
  imagesBase64: [] 
})

const accessToken = useCookie('access_token');  // 定義一個名為 jwt_token 的 Cookie

const items = ref([])
const totalItems = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const itemsPerPage = ref(5)
const errMsg = ref('')
const successMsg = ref('')

const dialog = ref(false)
const editData = ref(emptyProduct())

const newProductDialog = ref(false)
const newProductData = ref(emptyProduct())

const formValid = ref(false)
// 引用表單
const productForm = ref(null)

const requiredRule = value => !!value || '此欄位為必填'
const positiveNumberRule = value => value > 0 || '必須是正數'


const selectedFiles = ref([]);

const handleFileChange = (event) => {
  const files = event.target.files
  
  // 確認檔案是否選擇成功
  if (files.length > 0) {
    selectedFiles.value = files
    console.log('Selected Files:', selectedFiles.value)
  } else {
    selectedFiles.value = []
  }
  
  // 檢查每個檔案的大小
  for (let i = 0; i < files.length; i++) {
    console.log(`File ${i}: `, files[i].name, files[i].size, 'bytes');
  }
}


const submitForm = () => {
  // const form = ref('productForm').value
  // console.log(productForm.value);
  // console.log(productForm.value.validate());
  
  if (productForm.value.validate()) {
    // 驗證通過
    console.log('表單驗證通過，提交表單:', newProductData.value)
    saveNewProduct()
  } else {
    // 驗證失敗
    showMessage('驗證失敗：必填欄位請確認', 'error')
  }
}

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

    console.log(items.value);
    

    totalItems.value = res.data.totalElements
    totalPages.value = res.data.totalPages
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

const onPageChange = (newPage) => {
  fetchProducts(newPage)
}

onMounted(() => {
  fetchProducts(currentPage.value)
})


const showMessage = (message, type = 'error') => {
  if (type === 'error') {
    errMsg.value = message
    setTimeout(() => {
      errMsg.value = ''
    }, 2000)
  } else {
    successMsg.value = message
    setTimeout(() => {
      successMsg.value = ''
    }, 2000)
  }
}


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
    const res = await axios.patch(`http://localhost:8080/ticket/${editData.value.tktNo}/update`, editData.value,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
    )
    dialog.value = false
    showMessage('商品修改儲存成功', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

const openNewProductDialog = () => {
  newProductDialog.value = true
}

const saveNewProduct = async() => {
  newProductDialog.value = false

  const formData = new FormData()

  formData.append('tktName', newProductData.value.tktName);
  formData.append('originalAmount', newProductData.value.originalAmount);
  formData.append('price', newProductData.value.price);
  formData.append('tktStartDate', newProductData.value.tktStartDate);
  formData.append('tktEndDate', newProductData.value.tktEndDate);
  formData.append('locate', newProductData.value.locate);
  formData.append('instruction', newProductData.value.instruction);
  formData.append('address', newProductData.value.address);
  formData.append('notice', newProductData.value.notice);
  formData.append('howUse', newProductData.value.howUse);
  formData.append('canxpolicy', newProductData.value.canxpolicy);
  formData.append('tktStatus', newProductData.value.tktStatus);
  formData.append('soldAmount', newProductData.value.soldAmount);
  formData.append('kind', newProductData.value.kind);

  // 附加檔案到 formData
  console.log('selectedFiles.value.length: ' + selectedFiles.value.length);
  
  for (let i = 0; i < selectedFiles.value.length; i++) {
    formData.append('files', selectedFiles.value[i]);
  }

  // Print out all FormData key-value pairs
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  
  try {
    await axios.post('http://localhost:8080/ticket/generate', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})
    
    showMessage('商品新增成功', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  }
  
}




</script>
