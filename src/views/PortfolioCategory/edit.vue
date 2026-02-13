<template>
  <div class="container py-4">
    <b-card>
      <h5 class="mb-3">ویرایش دسته بندی</h5>
      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group label="عنوان فارسی" label-for="title_fa">
              <b-form-input id="title_fa" v-model="form.title_fa" :state="!errors.title_fa"
                placeholder="عنوان فارسی " />
              <b-form-invalid-feedback v-if="errors.title_fa">{{ errors.title_fa[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6">
            <b-form-group label="عنوان انگلیسی" label-for="title_en">
              <b-form-input id="title_en" v-model="form.title_en" :state="!errors.title_en"
                placeholder="عنوان انگلیسی " />
              <b-form-invalid-feedback v-if="errors.title_en">{{ errors.title_en[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="تصویر" label-for="image">
              <VueFileAgent @update:raw-model-value="imageLoaded" :raw-model-value="oldImage" :maxFiles="1"
                accept=".pdf,.jpg,.png" theme="grid" deletable sortable>
              </VueFileAgent>

              <small v-if="errors.icon" class="text-danger">{{ errors.icon[0] }}</small>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="عنوان متا" label-for="meta_title">
              <b-form-input id="meta_title" v-model="form.meta_title" :state="!errors.meta_title"
                placeholder="عنوان متا " />
              <b-form-invalid-feedback v-if="errors.meta_title">{{ errors.meta_title[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="توضیحات متا">
              <b-form-textarea v-model="form.meta_description" :state="!errors.meta_description" rows="2" />
              <b-form-invalid-feedback v-if="errors.meta_description">{{ errors.meta_description[0]
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
          <b-button v-if="checkPermission(['portfolio_category_update'])" type="submit" :disabled="loader"
            variant="primary">ویرایش
            دسته بندی</b-button>
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
  title_en: '',
  title_fa: '',
  meta_title: '',
  meta_description: '',
  show_in_home: '',
  icon: [],

})
const errors = reactive({})
onMounted(async () => {
  try {
    // GET اطلاعات عضو
    const res = await axios.get(`/portfolio-categories/${route.params.id}`)

    oldImage.value =
      [{
        name: res.data.data.icon.split('/').pop(),
        size: 0,
        type: 'image/jpeg',
        ext: res.data.data.icon.split('.').pop(),
        url: `${baseImageAddress}${res.data.data.icon}`,
      }];
    Object.assign(form, res.data.data);
  } catch (err) {
    console.log(err);
    toast.error('خطا در دریافت اطلاعات دسته بندی ❌')
  }
})
function imageLoaded(files) {
  if (files.length) {
    form.icon = files[0].file
  } else {
    form.icon = '';
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
      } else if (key != 'icon') formData.append(key, form[key])
    }
    formData.append("_method", "PUT");
    if (form.image) {
      formData.append("icon", form.image);
    }
    await axios.post(`/portfolio-categories/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('دسته بندی با موفقیت ویرایش شد ✅');
    setTimeout(() => {
      router.push('/portfolios/categories/list');
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
