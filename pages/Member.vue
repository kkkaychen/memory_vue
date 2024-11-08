<template>
  <v-app>
    <Menu/>
    <v-container>
      <h1>會員專區</h1>

      <!-- 1. 會員資料 -->
      <v-card class="mb-6">
        <v-card-title>會員資料</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-text-field label="姓名" v-model="memberData.name" readonly></v-text-field>
              <v-text-field label="電子郵件" v-model="memberData.email" readonly></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="電話號碼" v-model="memberData.phone" readonly></v-text-field>
              <v-text-field label="地址" v-model="memberData.address" readonly></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2. 訂單列表 -->
      <v-card class="mb-6">
        <v-card-title>訂單列表</v-card-title>
        <v-data-table
            :headers="orderHeaders"
            :items="orders"
            item-key="orderNumber"
            class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="viewOrderDetails(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- 3. 優惠券列表 -->
      <v-card class="mb-6">
        <v-card-title>優惠券列表</v-card-title>
        <v-data-table
            :headers="couponHeaders"
            :items="coupons"
            item-key="code"
            class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon color="primary" @click="applyCoupon(item)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import Menu from "~/components/front/Menu.vue";

const memberData = ref({
  name: '王小明',
  email: 'example@example.com',
  phone: '0912345678',
  address: '台北市信義區'
});

const orders = ref([
  { orderNumber: 'A12345', date: '2024-10-01', total: 1200, status: '已完成' },
  { orderNumber: 'B67890', date: '2024-09-20', total: 1500, status: '處理中' }
]);

const coupons = ref([
  { code: 'DISCOUNT10', description: '滿1000折扣10%', expiry: '2024-12-31' },
  { code: 'FREESHIP', description: '免運費', expiry: '2024-11-30' }
]);

const orderHeaders = [
  { text: '訂單編號', value: 'orderNumber' },
  { text: '訂單日期', value: 'date' },
  { text: '總金額', value: 'total' },
  { text: '訂單狀態', value: 'status' },
  { text: '操作', value: 'actions', sortable: false }
];

const couponHeaders = [
  { text: '優惠代碼', value: 'code' },
  { text: '說明', value: 'description' },
  { text: '有效期限', value: 'expiry' },
  { text: '操作', value: 'actions', sortable: false }
];

function viewOrderDetails(order) {
  alert(`查看訂單詳情：${order.orderNumber}`);
}

function applyCoupon(coupon) {
  alert(`已套用優惠券：${coupon.code}`);
}
</script>

<style scoped>
.mb-6 {
  margin-bottom: 24px;
}
</style>
