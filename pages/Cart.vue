<template>

  <v-app>
    <Menu/>
    <v-container>
      <v-row>

        <!-- 購物車 -->
        <v-col cols="10">
          <v-card class="pa-4">
            <v-card-title>購物車</v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="(item, index) in products" :key="index">
                <v-list-item-content>
                  <v-list-item-title>{{ item.tktName }}</v-list-item-title>
                  <v-list-item-subtitle>數量: {{ item.count }}</v-list-item-subtitle>
                  <v-list-item-subtitle>價格: ${{ item.price * item.count }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="updateQuantity(item, item.count - 1)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn icon @click="updateQuantity(item, item.count + 1)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteItem(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-card-subtitle>總金額: ${{ totalPrice }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="success">結帳</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import Menu from "~/components/front/Menu.vue";
import axios from 'axios';
import { parseJwt } from '~/utils/jwt.js'

const products = ref([]);
const accessToken = useCookie('member_access_token').value
const userInfo = accessToken ? parseJwt(accessToken) : null
const memNo = userInfo?.memNo;

async function showCartList() {
  // console.log(userInfo)
  try {
    const res = await axios.post(`http://localhost:8080/cart/cartList?memNo=${memNo}`);
    products.value = res.data.items;
    console.log(products.value)
  } catch (error) {
    console.error('Error fetching cartList:', error);
  }
}

async function deleteItem(item) {
  try {
    const res = await axios.delete(`http://localhost:8080/cart/${memNo}/items/${item.tktNo}`);
    await showCartList()
    console.log(res.data)
  } catch (error) {
    console.error('Error fetching delete:', error);
  }
}

function updateQuantity(item, count) {
  if (count < 1) {
    products.value = products.value.filter((cartItem) => cartItem !== item);
  } else {
    item.count = count;
  }
}

const totalPrice = computed(() =>
    products.value.reduce((total, item) => total + item.price * item.count, 0)
);

// 在頁面載入時執行
onMounted(() => {
  showCartList();
})
</script>

<style scoped>
.v-container {
  max-width: 1000px;
  margin: auto;
}

</style>
