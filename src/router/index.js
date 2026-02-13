import { createRouter, createWebHistory } from "vue-router";
import login from "../views/login.vue";
import dashboard from "../views/dashboard/dashboard.vue";

const routes = [
  { path: "/login", name: "login", component: login },
  { path: "/dashboard", name: "dashboard", component: dashboard },
  {
    path: "/users",
    name: "users-list",
    component: () => import("@/views/users/User/list.vue"),
  },
  {
    path: "/users/detail/:id",
    name: "users-detail",
    component: () => import("@/views/users/User/detail.vue"),
  },

  {
    path: "/users/create",
    name: "users-create",
    component: () => import("@/views/users/User/create.vue"),
  },

  {
    path: "/users/:id/edit",
    name: "users-edit",
    component: () => import("@/views/users/User/edit.vue"),
  },

  {
    path: "/users/managers",
    name: "users-managers",
    component: () => import("@/views/users/Manager/list.vue"),
  },

  {
    path: "/users/managers/create",
    name: "users-managers-create",
    component: () => import("@/views/users/Manager/create.vue"),
  },
  {
    path: "/users/managers/:id/edit",
    name: "users-managers-edit",
    component: () => import("@/views/users/Manager/edit.vue"),
  },

  {
    path: "/users/roles",
    name: "users-roles",
    component: () => import("@/views/users/Role/list.vue"),
  },
  {
    path: "/users/roles/create",
    name: "users-roles-create",
    component: () => import("@/views/users/Role/create.vue"),
  },
  {
    path: "/users/roles/:id/edit",
    name: "users-roles-edit",
    component: () => import("@/views/users/Role/edit.vue"),
  },

  {
    path: "/wallets",
    name: "wallets",
    component: () => import("@/views/wallet/Wallet/list.vue"),
  },
  {
    path: "/wallet-transaction",
    name: "wallet-transactions",
    component: () => import("@/views/wallet/Wallet/transactions.vue"),
  },

  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/settings/index.vue"),
  },
  {
    path: "/users/employers/list",
    name: "employers-list",
    component: () => import("@/views/Employer/list.vue"),
  },
  {
    path: "/users/employers/create",
    name: "employers-create",
    component: () => import("@/views/Employer/create.vue"),
  },
  {
    path: "/users/employers/:id/edit",
    name: "employers-edit",
    component: () => import("@/views/Employer/edit.vue"),
  },
  {
    path: "/team/list",
    name: "team-list",
    component: () => import("@/views/Team/list.vue"),
  },
  {
    path: "/team/create",
    name: "team-create",
    component: () => import("@/views/Team/create.vue"),
  },
  {
    path: "/team/:id/edit",
    name: "team-edit",
    component: () => import("@/views/Team/edit.vue"),
  },
  {
    path: "/portfolios/list",
    name: "portfolios-list",
    component: () => import("@/views/Portfolio/list.vue"),
  },
  {
    path: "/portfolios/create",
    name: "portfolios-create",
    component: () => import("@/views/Portfolio/create.vue"),
  },
  {
    path: "/portfolios/:id/edit",
    name: "portfolios-edit",
    component: () => import("@/views/Portfolio/edit.vue"),
  },
  {
    path: "/portfolios/categories/list",
    name: "portfolios-categories-list",
    component: () => import("@/views/PortfolioCategory/list.vue"),
  },
  {
    path: "/portfolios/categories/create",
    name: "portfolios-categories-create",
    component: () => import("@/views/PortfolioCategory/create.vue"),
  },
  {
    path: "/portfolios/categories/:id/edit",
    name: "portfolios-categories-edit",
    component: () => import("@/views/PortfolioCategory/edit.vue"),
  },
  {
    path: "/history/list",
    name: "history-list",
    component: () => import("@/views/History/list.vue"),
  },
  {
    path: "/history/create",
    name: "history-create",
    component: () => import("@/views/History/create.vue"),
  },
  {
    path: "/history/:id/edit",
    name: "history-edit",
    component: () => import("@/views/History/edit.vue"),
  },

  {
    path: "/comments/articles",
    name: "comments-articles",
    component: () => import("@/views/comments/Articles.vue"),
  },
  {
    path: "/location/provinces/list",
    name: "location-province-list",
    component: () => import("@/views/location/Province/list.vue"),
  },

  {
    path: "/location/provinces/create",
    name: "location-province-create",
    component: () => import("@/views/location/Province/create.vue"),
  },

  {
    path: "/location/provinces/:id/edit",
    name: "location-province-edit",
    component: () => import("@/views/location/Province/edit.vue"),
  },

  {
    path: "/location/cities/list",
    name: "location-cities-list",
    component: () => import("@/views/location/City/list.vue"),
  },

  {
    path: "/location/cities/create",
    name: "location-cities-create",
    component: () => import("@/views/location/City/create.vue"),
  },

  {
    path: "/location/cities/:id/edit",
    name: "location-cities-edit",
    component: () => import("@/views/location/City/edit.vue"),
  },

  {
    path: "/reports/users",
    name: "reports-users",
    component: () => import("@/views/reports/users.vue"),
  },

  { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
