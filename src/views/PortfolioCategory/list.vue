<template>
  <div class="container mt-4">

    <!-- دکمه افزودن -->
    <div class="mb-3 text-end">
      <router-link v-if="checkPermission(['portfolio_category_store'])" to="/portfolios/categories/create"
        class="btn btn-success">
        افزودن دسته بندی
      </router-link>
    </div>

    <!-- جدول -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">در حال بارگذاری...</span>
          </div>
        </div>

        <div class="table-box" v-else>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>شناسه</th>
                <th>عنوان فارسی</th>
                <th>عنوان انگلیسی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in categories" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title_fa }}</td>
                <td>{{ item.title_en }}</td>
                <td>
                  <router-link v-if="checkPermission(['portfolio_category_update'])"
                    :to="`/portfolios/categories/${item.id}/edit`" class="btn btn-sm btn-warning me-2">
                    ویرایش
                  </router-link>
                  <button class="btn btn-sm btn-danger" v-if="checkPermission(['portfolio_category_delete'])"
                    @click="deleteitem(item.id)">
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdmin } from '@/stores/modules/admin';
const store = useAdmin();
const checkPermission = store.checkPermission;
const categories = ref(null);
const loading = ref(false);
let currentUrl = "/portfolio-categories";
async function getCategories(url) {
  loading.value = true;
  try {
    const { data } = await axios.get(url);
    categories.value = data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};



const deleteitem = (id) => {
  Swal.fire({
    title: "حذف دسته بندی",
    text: "آیا مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/portfolio-categories/${id}`);
        Swal.fire("موفق", "دسته بندی حذف شد", "success");
        getCategories('/portfolio-categories');
      } catch (err) {
        Swal.fire("خطا", "مشکلی در حذف پیش آمد", "error");
      }
    }
  });
};

onMounted(() => {
  getCategories(currentUrl);
});
function imageFinder(imageSrc) {
  return baseImageAddress + imageSrc
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.profile {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
