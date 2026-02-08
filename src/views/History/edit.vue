<template>
  <div class="container py-4">
    <b-card>
      <h5 class="mb-3">ویرایش تاریخچه</h5>
      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <b-col cols="12" md="6">
            <b-form-group label="عنوان" label-for="title">
              <b-form-input id="title" v-model="form.title" :state="!errors.title" placeholder="عنوان تاریخچه" />
              <b-form-invalid-feedback v-if="errors.title">{{ errors.title[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="تاریخ وقوع">
              <date-picker display-format="jYYYY/jMM/jDD" format="YYYY-MM-DD" v-model="form.date" />
              <small class="text-danger" v-if="errors.date">{{ errors.date[0] }}</small>

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
            <b-form-group label="توضیحات">
              <b-form-textarea v-model="form.description" :state="!errors.description" rows="2" />
              <b-form-invalid-feedback v-if="errors.description">{{ errors.description[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>


        </b-row>

        <div class="mt-3">
          <b-button v-if="checkPermission(['history_update'])" type="submit" :disabled="loader" variant="primary">ویرایش
            تاریخچه</b-button>
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
  title: '',
  description: '',
  date: '',
  image: [],

})
const errors = reactive({})
onMounted(async () => {
  try {
    // GET اطلاعات تاریخچه
    const res = await axios.get(`/histories/${route.params.id}`)

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
    toast.error('خطا در دریافت اطلاعات تاریخچه ❌')
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
      if (key != 'image') formData.append(key, form[key])
    }
    formData.append("_method", "PUT");
    if (form.image) {
      formData.append("image", form.image);
    }
    await axios.post(`/histories/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('تاریخچه با موفقیت ویرایش شد ✅');
    setTimeout(() => {
      router.push('/history/list');
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
