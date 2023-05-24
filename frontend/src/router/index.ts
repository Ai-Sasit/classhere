import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "list-class",
    component: () => import("../views/ListClass.vue"),
  },
  {
    path: "/add-class",
    name: "add-class",
    component: () => import("../views/AddClass.vue"),
  },
  {
    path: "/edit-class/:id",
    name: "edit-class",
    component: () => import("../views/EditClass.vue"),
  },
  {
    path: "/check-in/:id",
    name: "check-in",
    component: () => import("../views/CheckIn.vue"),
  },
  {
    path: "/student-submit/:token",
    name: "student-submit",
    component: () => import("../views/StudentSubmit.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
