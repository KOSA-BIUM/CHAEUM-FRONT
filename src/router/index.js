import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "calendar",
    component: () => import("@/pages/Calendar.vue"),
    meta: { title: "캘린더" },
  },
  {
    path: "/signin",
    name: "signin",
    component: () => import("@/pages/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/pages/SignUp.vue"),
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
    meta: { title: "프로필" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
