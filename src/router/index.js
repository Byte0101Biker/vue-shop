import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Cart from "../views/Cart.vue";
import AdminOrders from "../views/AdminOrders.vue";
import MyOrders from "../views/MyOrders.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contact", component: Contact },
  { path: "/admin", component: Admin },
  { path: "/admin-orders", component: AdminOrders },
  { path: "/cart", component: Cart },
  { path: "/my-orders", component: MyOrders },
  { path: "/login", component: Login },
];

const router = createRouter({
  // 👇 NAJWAŻNIEJSZA ZMIANA
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
