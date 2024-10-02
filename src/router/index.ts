import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from "@/stores/auth";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { initDynamicRouter } from "@/router/modules/dynamicRouter";
import HomeView from '../views/home/index.vue'
import LoginView from '../views/login/index.vue'
import { useUserInfoStore } from '@/stores/userInfo';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: "/layout",
      name: "layout",
      component: () => import("@/layouts/index.vue"),
      redirect: '/',
      children: []
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const userStore = useAuthStore();
  const authStore = useAuthMenuStore();

  // 2.动态设置标题
  const title = 'blogvue3';
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === '/login') {
    if (userStore.token) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
  if (["/500"].includes(to.path)) return next();

  // 5.判断是否有 Token，没有重定向到 login 页面
  if (!userStore.token) return next({ path: '/login', replace: true });

  // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!authStore.authMenuListGet.length) {
    const userInfoStore = useUserInfoStore();
    const menuReq: Menu.MenuRequest = { uid: userInfoStore.user?.uID || '12'};
    await initDynamicRouter(menuReq);
    return next({ ...to, replace: true });
  }

  // 7.存储 routerName 做按钮权限筛选
  authStore.setRouteName(to.name as string);

  // 8.正常访问页面
  next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {
  const authStore = useAuthMenuStore();
  authStore.flatMenuListGet.forEach(route => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
};

export default router
