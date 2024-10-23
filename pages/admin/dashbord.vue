<template>
    <v-layout>
      <v-navigation-drawer v-model="drawer">
        <v-list density="compact">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            link
            nav
            @click="selectedItem = item.title"
          >
            <v-list-item-icon>
              <v-icon>{{ item.prependIcon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar border="b" class="ps-4" flat>
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />
  
        <v-app-bar-title>Memory Dashboard</v-app-bar-title>
  
        <template #append>
          <v-btn class="text-none me-2" height="48" icon slim>
            <v-avatar color="surface-light" image="/images/cat.jpg" size="32" />
  
            <v-menu activator="parent">
              <v-list density="compact" nav>
                <v-list-item append-icon="mdi-cog-outline" link title="Settings" />
  
                <v-list-item append-icon="mdi-logout" link title="Logout" @click="logout()"/>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-app-bar>
  
      <v-main>
        <div class="pa-4">
          <v-sheet
            border="dashed md"
            color="surface-light"
            height="500"
            rounded="lg"
            width="100%"
          >
            <!-- 動態顯示對應的組件 -->
            <component :is="currentComponent" />
          </v-sheet>
        </div>
      </v-main>
    </v-layout>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import MemberManagement from '~/components/MemberManagement.vue'
  import OrderManagement from '~/components/OrderManagement.vue'
  import ProductManagement from '~/components/ProductManagement.vue'
  import CouponManagement from '~/components/CouponManagement.vue'
  import Report from '~/components/Report.vue'
  import { useRouter } from 'vue-router'
  
  const drawer = ref(true)
  const selectedItem = ref('會員管理')  // 預設選中的項目
  const router = useRouter()
  const tokenCookie = useCookie('jwt_token');  // 定義一個名為 jwt_token 的 Cookie

  const logout = async() => {
    tokenCookie.value = null;
    // 跳轉到登錄頁面
    router.push('/admin/login');
  }

  // 根據選擇的項目動態返回對應的組件
  const currentComponent = computed(() => {
    switch (selectedItem.value) {
      case '會員管理':
        return MemberManagement
      case '訂單管理':
        return OrderManagement
      case '商品管理':
        return ProductManagement
      case '優惠券管理':
        return CouponManagement
      case '報表':
        return Report
      default:
        return MemberManagement
    }
  })
  
  const items = ref([
    { title: '會員管理', prependIcon: 'mdi-view-dashboard-outline', link: true },
    { title: '訂單管理', prependIcon: 'mdi-account-group', link: true },
    { title: '商品管理', prependIcon: 'mdi-briefcase-outline', link: true },
    { title: '優惠券管理', prependIcon: 'mdi-calendar', link: true },
    { title: '報表', prependIcon: 'mdi-file-chart-outline', link: true },
  ])
  </script>
  