<template>
  <div class="container py-4">
    <b-card>
      <h5 class="mb-3">ویرایش عضو</h5>
      <b-form @submit.prevent="handleSubmit">
        <b-row>

          <b-col cols="12" md="12">
            <b-form-group label="شماره موبایل" label-for="mobile">
              <b-form-input id="mobile" v-model="form.mobile" :state="!errors.mobile"
                placeholder="شماره موبایل کارفرما" />
              <b-form-invalid-feedback v-if="errors.mobile">{{ errors.mobile[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="عنوان کسب و کار ">
              <b-form-input v-model="form.business_label" :state="!errors.business_label" type="text"
                placeholder="مثال: 5" />
              <b-form-invalid-feedback v-if="errors.business_label">{{ errors.business_label[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="12">
            <b-form-group label="لوگو کسب و کار">
              <VueFileAgent @update:raw-model-value="imageLoaded1" :raw-model-value="oldImage1" :maxFiles="1"
                accept=".pdf,.jpg,.png" theme="grid" deletable sortable>
              </VueFileAgent>
              <small v-if="errors.business_logo" class="text-danger">{{ errors.business_logo[0] }}</small>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="mt-3">
          <b-button v-if="checkPermission(['employer_update'])" type="submit" :disabled="loader"
            variant="primary">ویرایش
            کارفرما</b-button>
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
const oldImage1 = ref([]);
const form = reactive({
  mobile: '',
  business_label: '',
  business_logo: [],

})
const errors = reactive({})
onMounted(async () => {
  try {
    // GET اطلاعات عضو
    const res = await axios.get(`/employers/${route.params.id}`)
    oldImage1.value =
      [{
        name: res.data.data.business_logo.split('/').pop(),
        size: 0,
        type: 'image/jpeg',
        ext: res.data.data.business_logo.split('.').pop(),
        url: `${baseImageAddress}${res.data.data.business_logo}`,
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
function imageLoaded1(files) {
  if (files.length) {
    form.business_logo = files[0].file
  } else {
    form.business_logo = '';
  }
}
const handleSubmit = async () => {
  loader.value = true;
  Object.keys(errors).forEach(k => delete errors[k])
  try {
    const formData = new FormData()
    for (const key in form) {
      if (key != 'business_logo') formData.append(key, form[key])
    }
    formData.append("_method", "PUT");

    if (form.business_logo) {
      formData.append("business_logo", form.business_logo);
    }1
    await axios.post(`/employers/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('کارفرما با موفقیت ویرایش شد ✅');
    setTimeout(() => {
      router.push('/users/employers/list');
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
