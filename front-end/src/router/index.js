import Vue from "vue";
import VueRouter from "vue-router";
import Profile from "../views/Profile.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/add",
    name: "Add",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Add.vue"),
  },
  {
    path: "/",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Search.vue"),
  },
  {
    path: "/listing/:id",
    name: "Listing",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Listing.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
