// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
  css: [
    'vuetify/styles', // 在這裡引入 vuetify 樣式
  ],
  plugins: ['~/plugins/vuetify.ts'], // 加載插件
})
