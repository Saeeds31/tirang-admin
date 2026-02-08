<template>
  <div id="sidebar">
    <!-- Overlay موبایل -->
    <b-collapse v-model="mobileOpen" class="d-lg-none">
      <div class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style="z-index: 1000;"
        @click="mobileOpen = false"></div>
    </b-collapse>
    <!-- Sidebar -->
    <div class="sidebar d-flex flex-column bg-light" :class="{ 'sidebar-open': mobileOpen }">
      <!-- Logo -->
      <router-link to="#" class="p-3 d-flex justify-content-center border-bottom">
        <img src="../../assets/images/logo.png" alt="Logo" class="img-fluid" />
      </router-link>

      <!-- Menu Items -->
      <b-nav vertical class="flex-column mt-2">
        <div v-for="item in menuItems" :key="item.name" class="w-100">
          <!-- آیتم اصلی -->
          <b-nav-item v-if="!item.children && checkPermission(item.permissions)" :to="item.link"
            class="d-flex align-items-center">
            <i :class="item.icon + ' me-2'"></i>
            <span v-if="mobileOpen || windowWidth < 992">{{ item.name }}</span>
          </b-nav-item>

          <!-- آیتم با زیرمنو -->
          <div v-else-if="checkPermission(item.permissions, 'or')">
            <button class=" navItem btn w-100 text-start d-flex align-items-center" @click="toggleSubmenu(item)">
              <i :class="item.icon + ' me-2'"></i>
              <span v-if="mobileOpen || windowWidth < 992">{{ item.name }}</span>
              <i class="mr-auto bi" :class="openSubmenu === item.name ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </button>
            <b-collapse v-model="openSubmenuStates[item.name]" class="ps-4">
              <b-nav vertical>
                <template v-for="child in item.children" :key="child.name">
                  <b-nav-item v-if="checkPermission(child.permissions)" :to="child.link"
                    class="d-flex align-items-center">
                    <i :class="child.icon + ' me-2'"></i>
                    <span v-if="mobileOpen || windowWidth < 992">{{ child.name }}</span>
                  </b-nav-item>
                </template>
              </b-nav>
            </b-collapse>
          </div>
        </div>
      </b-nav>
    </div>
    <!-- Toggle Button موبایل -->
    <b-button variant="primary" id="toggleMenuButton" class="d-lg-none position-fixed top-3 start-3"
      @click="mobileOpen = !mobileOpen">
      <i class="bi-list"></i>
    </b-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BNav, BNavItem, BButton, BCollapse } from "bootstrap-vue-3";
import { useAdmin } from '@/stores/modules/admin';
const store = useAdmin();
const checkPermission = store.checkPermission;
const mobileOpen = ref(true);
const windowWidth = ref(window.innerWidth);
// ذخیره وضعیت باز/بسته بودن زیرمنوها
const openSubmenuStates = ref({});
const openSubmenu = ref(null);
const toggleSubmenu = (item) => {
  openSubmenuStates.value[item.name] = !openSubmenuStates.value[item.name];
  openSubmenu.value = openSubmenuStates.value[item.name] ? item.name : null;
};
// منوها

const menuItems = [
  { name: "داشبورد", link: "/", icon: "bi-speedometer", permissions: ['dashboard_view'] },

  {
    permissions: ['user_view', 'role_view', 'manage_view', 'team_view', 'employers_view'],
    name: "کاربران",
    icon: "bi-people",
    children: [
      { name: "لیست کاربران", link: "/users", permissions: ['user_view'], icon: "bi-list-ul" },

      {
        name: "تیم",
        permissions: ['team_view'],
        icon: "bi-people",
        link: "/team/list",
      },
      { name: "نقش ها", link: "/users/roles", permissions: ['role_view'], icon: "bi-person-badge" },
      { name: "مدیران", link: "/users/managers", permissions: ['manager_view'], icon: "bi-shield-check" },
      { name: "کارفرمایان", link: "/users/employers", permissions: ['employers_view'], icon: "bi-person" },
      { name: "دسترسی شهری", link: "/users/city-permission", permissions: ['citypermission_view'], icon: "bi-building" },
    ],
  },
  {
    name: "تاریخچه",
    permissions: ['history_view'],
    icon: "bi-clock-history",
    link: "/history/list",
  },
  {
    name: "تنظیمات",
    permissions: ['setting_view'],
    icon: "bi-gear",
    link: "/settings",
  },
];

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < 768) {
    mobileOpen.value = false;
  } else {
    mobileOpen.value = true;

  }
};
onMounted(() => {
  window.addEventListener("resize", updateWidth);
  updateWidth();
});
onBeforeUnmount(() => window.removeEventListener("resize", updateWidth));

</script>

<style scoped>
.sidebar {
  width: 250px;
  transition: width 0.2s;
  height: 100vh;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-open {
  width: 250px;
  /* expanded */
}

.nav-link {
  padding: 0.5rem 1rem;
}

@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    z-index: 1050;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  button#toggleMenuButton {
    z-index: 1000;
    right: 8px;
    top: 8px;
  }
}
</style>
