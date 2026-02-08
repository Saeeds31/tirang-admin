<template>
  <div class="container py-4">
    <b-card>
      <h5 class="mb-3">ویرایش عضو</h5>
      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <!-- Title -->
          <b-col cols="12" md="6">
            <b-form-group label="عنوان" label-for="full_name">
              <b-form-input id="full_name" v-model="form.full_name" :state="errors.full_name ? false : null" />
              <small v-if="errors.full_name" class="text-danger">{{ errors.full_name[0] }}</small>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6">
            <b-form-group label="سمت" label-for="post">
              <b-form-input id="post" v-model="form.post" :state="!errors.post" placeholder="سمت عضو" />
              <b-form-invalid-feedback v-if="errors.post">{{ errors.post[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="جایگاه نمایشی ">
              <b-form-input v-model="form.sort_order" :state="!errors.sort_order" type="number" placeholder="مثال: 5" />
              <b-form-invalid-feedback v-if="errors.sort_order">{{ errors.sort_order[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6">
            <b-form-group label="شماره تماس ">
              <b-form-input v-model="form.mobile" :state="!errors.mobile" type="tel" placeholder="مثال: 5" />
              <b-form-invalid-feedback v-if="errors.mobile">{{ errors.mobile[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="تصویر" label-for="image">
              <VueFileAgent @update:raw-model-value="imageLoaded" :raw-model-value="oldImage" :maxFiles="1"
                accept=".pdf,.jpg,.png" theme="grid" deletable sortable>
              </VueFileAgent>

              <small v-if="errors.image" class="text-danger">{{ errors.image[0] }}</small>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="بیوگرافی">
              <b-form-textarea v-model="form.biography" :state="!errors.biography" rows="2" />
              <b-form-invalid-feedback v-if="errors.biography">{{ errors.biography[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="نمایش در صفحه اصلی" label-for="show_in_home">
              <b-form-checkbox id="show_in_home" v-model="form.show_in_home"
                :state="errors.show0_in_home ? false : null" :true-value="1" :false-value="0">
                فعال
              </b-form-checkbox>
              <small v-if="errors.show_in_home" class="text-danger">{{ errors.show_in_home[0] }}</small>
            </b-form-group>
          </b-col>

        </b-row>

        <div class="mt-3">
          <b-button v-if="checkPermission(['team_update'])" type="submit" :disabled="loader" variant="primary">ویرایش
            عضو</b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { BForm, BFormGroup, BFormInput, BButton, BCard, BRow, BCol } from 'bootstrap-vue-3'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { useRoute, useRouter } from 'vue-router'
import { useAdmin } from '@/stores/modules/admin';
let loader = ref(false);
const store = useAdmin();
const router = useRouter();
const checkPermission = store.checkPermission;
const route = useRoute();
const oldImage = ref([]);
const form = reactive({
  full_name: '',
  post: '',
  mobile: '',
  biography: '',
  show_in_home: '',
  sort_order: '',
  image: [],

})
const errors = reactive({})
onMounted(async () => {
  try {
    // GET اطلاعات عضو
    const res = await axios.get(`/teams/${route.params.id}`)

    oldImage.value =
      [{
        name: res.data.data.image.split('/').pop(),
        size: 0,
        type: 'image/jpeg',
        ext: res.data.data.image.split('.').pop(),
        url: `${baseImageAddress}${res.data.data.image}`,
      }];
    Object.assign(form, res.data.data);
  } catch (err) {
    console.log(err);
    toast.error('خطا در دریافت اطلاعات عضو ❌')
  }
})
function imageLoaded(files) {
  if (files.length) {
    form.image = files[0].file
  } else {
    form.image = '';
  }
}
const handleSubmit = async () => {
  loader.value = true;
  Object.keys(errors).forEach(k => delete errors[k])
  try {
    const formData = new FormData()
    for (const key in form) {
      if (key == 'show_in_home') {
        formData.append(key, Number(form[key]))
      } else if (key != 'image') formData.append(key, form[key])
    }
    formData.append("_method", "PUT");
    if (form.image) {
      formData.append("image", form.image);
    }
    await axios.post(`/teams/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('عضو با موفقیت ویرایش شد ✅');
    setTimeout(() => {
      router.push('/team/list');
    }, 1500);
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
      toast.error('خطاهای فرم را بررسی کنید ❌')
    } else {
      toast.error('خطا در ارسال اطلاعات ❌')
    }
  } finally {
    loader.value = false;
  }
}
</script>
