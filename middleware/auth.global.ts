
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
  sub: string;       // 用戶名或用戶 ID
  role: string;      // 用戶角色，例如 'admin' 或 'user'
  exp: number;       // 到期時間，Unix 時間戳格式
}

export default defineNuxtRouteMiddleware((to, from) => {
  const empAccessToken = useCookie('emp_access_token').value;
  const memberAccessToken = useCookie('member_access_token').value;
  // 如果沒有 Token，且當前路徑需要權限保護，則重定向到相應的登入頁面
  if (!empAccessToken) {
    if (to.path.startsWith('/admin/*')) {
      return navigateTo('/admin/login');
    }
  }

  if (!memberAccessToken) {
    if (to.path.startsWith('/member') || to.path.startsWith('/cart')) {
      return navigateTo('/UserLogin');
    }
  }

  // 如果有 Token，解析角色信息並根據角色進行重定向
  // if (accessToken) {
  //   try {
  //     const decodedToken = jwtDecode<JwtPayload>(accessToken);
  //     const role = decodedToken.role;
  //
  //     // 根據角色進行判斷
  //     if (role === 'admin' && to.path === '/admin/login') {
  //       // 如果是後台員工登入，且當前路徑是 /admin/login，重定向到後台儀表板
  //       return navigateTo('/admin/dashbord');
  //     }
  //
  //     if (role === 'user' && to.path === '/UserLogin') {
  //       // 如果是前台使用者登入，且在嘗試訪問管理員頁面或再次進入登錄頁，重定向到會員頁面
  //       return navigateTo('/member');
  //     }
  //   } catch (e) {
  //     console.error("Token decoding failed:", e);
  //     // 如果 Token 解碼失敗，可能是無效的 Token，重定向到登錄頁面
  //     if (to.path.startsWith('/admin')) {
  //       return navigateTo('/admin/login');
  //     } else {
  //       return navigateTo('/UserLogin');
  //     }
  //   }
  // }
});
