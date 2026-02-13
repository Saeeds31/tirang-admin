<template>
  <div class="container mt-4">

    <!-- دکمه افزودن -->
    <div class="mb-3 text-end">
      <router-link v-if="checkPermission(['employer_store'])" to="/users/employers/create" class="btn btn-success">
        افزودن کارفرما
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
                <th>نام کامل</th>
                <th>عنوان کسب و کار</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in employers" :key="item.id">
                <td>{{ item.id }}</td>

                <td>{{ item.full_name }}</td>
                <td>{{ item.business_label }}</td>
                <td>
                  <router-link v-if="checkPermission(['employer_update'])" :to="`/users/employers/${item.id}/edit`"
                    class="btn btn-sm btn-warning me-2">
                    ویرایش
                  </router-link>
                  <button class="btn btn-sm btn-danger" v-if="checkPermission(['employer_delete'])"
                    @click="deleteItem(item.id)">
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
const employers = ref(null);
const loading = ref(false);
let currentUrl = "/employers";
async function getEmployers(url) {
  loading.value = true;
  try {
    const { data } = await axios.get(url);
    employers.value = data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};



const deleteItem = (id) => {
  Swal.fire({
    title: "حذف کارفرما",
    text: "آیا مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`/employers/${id}`);
        Swal.fire("موفق", "کارفرما حذف شد", "success");
        getEmployers('/employers');
      } catch (err) {
        Swal.fire("خطا", "مشکلی در حذف پیش آمد", "error");
      }
    }
  });
};

onMounted(() => {
  getEmployers(currentUrl);
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
