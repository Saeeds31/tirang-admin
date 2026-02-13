<template>
  <div class="container mt-4">

    <!-- دکمه افزودن -->
    <div class="mb-3 text-end">
      <router-link v-if="checkPermission(['portfolio_store'])" to="/portfolios/create" class="btn btn-success">
        افزودن نمونه کار
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
                <th>عنوان</th>
                <th>کارفرما</th>
                <th>دسته بندی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in portfolios.data" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.employer?.full_name }}</td>
                <td>{{ item.category?.title_fa }}</td>
                <td>
                  <router-link v-if="checkPermission(['portfolio_update'])" :to="`/portfolios/${item.id}/edit`"
                    class="btn btn-sm btn-warning me-2">
                    ویرایش
                  </router-link>
                  <button class="btn btn-sm btn-danger" v-if="checkPermission(['portfolio_delete'])"
                    @click="deleteitem(item.id)">
                    حذف
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <b-pagination v-model="portfolios.current_page" :total-rows="portfolios.total"
            v-if="portfolios.last_page != 1" :per-page="portfolios.per_page" @Update:modelValue="changePage"
            align="center" class="mt-3"></b-pagination>

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
const portfolios = ref({ data: [] });
const loading = ref(false);
let currentUrl = "/portfolios";
async function getPortfolios(url) {
  loading.value = true;
  try {
    const { data } = await axios.get(url);
    portfolios.value = data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};



const deleteitem = (id) => {
  Swal.fire({
    title: "حذف نمونه کار",
    text: "آیا مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/portfolios/${id}`);
        Swal.fire("موفق", "نمونه کار حذف شد", "success");
        getPortfolios('/portfolios');
      } catch (err) {
        Swal.fire("خطا", "مشکلی در حذف پیش آمد", "error");
      }
    }
  });
};

const changePage = (page) => {
  if (page) getPortfolios(`${currentUrl}?page=${page}`);
  else currentUrl = "/portfolio"
};
onMounted(() => {
  getPortfolios(currentUrl);
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
