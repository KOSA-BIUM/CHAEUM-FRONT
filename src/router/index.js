import { createRouter, createWebHistory } from "vue-router";
import { getAccessToken } from '@/lib/http';

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: { title: "홈" },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("@/pages/Calendar.vue"),
    meta: { title: "캘린더" },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/Login.vue"),
  },
  /*
  {
    path: "/signin",
    name: "signin",
    component: () => import("@/pages/SignIn.vue"),
  },
  */
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/pages/SignUp.vue"),
  },
  { 
    path: '/callback', 
    component: () => import("@/pages/Callback.vue") 
  },
  {
    path: "/ai_meal",
    name: "ai_meal",
    component: () => import("@/pages/AiMeal.vue"),
    meta: { title: "AI 식단추천" },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/pages/Profile.vue"),
    meta: { title: "프로필", requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;
  if (getAccessToken()) return true;
  return '/login';
});

export default router;
