export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('jwt_token');
  console.log("middleWare token: " + token);
  

  // 如果沒有 Token，並且當前路徑不是 /admin/login，則重定向到 /admin/login
  if (!token.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login');
  }

  // 如果已經有 Token，並且用戶正在訪問 /admin/login 頁面，則跳轉到 /admin/dashboard
  if (token.value && to.path === '/admin/login') {
    return navigateTo('/admin/dashbord');
  }
});
