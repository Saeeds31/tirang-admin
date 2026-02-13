<template>
  <div class="container py-4">
    <b-card>
      <h5 class="mb-3">ویرایش نمونه کار</h5>
      <b-form @submit.prevent="handleSubmit">
        <b-row>
          <b-col cols="12" md="12">
            <b-form-group label="عنوان" label-for="title">
              <b-form-input id="title" v-model="form.title" :state="!errors.title" placeholder="عنوان " />
              <b-form-invalid-feedback v-if="errors.title">{{ errors.title[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6">
            <b-form-group label="تصویر" label-for="image">
              <VueFileAgent @update:raw-model-value="imageLoaded" :raw-model-value="oldImage" :maxFiles="1"
                accept=".pdf,.jpg,.png" theme="grid" deletable sortable>
              </VueFileAgent>
              <small v-if="errors.image" class="text-danger">{{ errors.image[0] }}</small>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6">
            <b-form-group label="ویدیو" label-for="video">
              <VueFileAgent @update:raw-model-value="videoLoaded" :raw-model-value="oldVideo" :maxFiles="1"
                accept=".mp4,.mkv" theme="grid" deletable sortable>
              </VueFileAgent>
              <small v-if="errors.video" class="text-danger">{{ errors.video[0] }}</small>
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6" v-if="categories.length">
            <b-form-group label="دسته‌بندی " label-for="category_id">
              <Treeselect id="category_id" :multiple="false" v-model="form.category_id" :normalizer="normalizer"
                :options="categories" placeholder="انتخاب دسته‌بندی " :clearable="true" :valueConsistsOf="'ALL'" />
              <small class="text-danger" v-if="errors.category_id">{{ errors.category_id[0]
              }}</small>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6" v-if="employers.length">
            <b-form-group label="کارفرما" label-for="category_id">
              <Treeselect id="employer_id" :multiple="false" v-model="form.employer_id" :normalizer="normalizer1"
                :options="employers" placeholder="انتخاب کارفرما " :clearable="true" :valueConsistsOf="'ALL'" />
              <small class="text-danger" v-if="errors.employer_id">{{ errors.employer_id[0]
              }}</small>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group label="توضیحات ">
              <Editor v-model="form.description" />
              <small class="text-danger" v-if="errors.description">{{ errors.description[0]
              }}</small>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="تصاویر جدید">
              <VueFileAgent @select="imagesLoaded" :multiple="true" accept=".jpg,.png,.pdf" theme="grid" deletable
                sortable />
            </b-form-group>
          </b-col>

          <b-col cols="12" md="6" v-if="form.images.length">
            <b-form-group label="تصاویر قبلی" label-for="images">
              <div id="oldImagesBox">
                <div class="imageHolder" v-for="(item, index) in form.images" :key="index">
                  <img :src="imageFinder(item.path)" alt="">
                  <button type="button" @click="deleteImage(item.id, index)">
                    <i class="bi-trash"></i>
                  </button>
                </div>
              </div>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="لینک شبکه اجتماعی" label-for="social_link">
              <b-form-input id="social_link" v-model="form.social_link" :state="!errors.social_link"
                placeholder="لینک شبکه اجتماعی " />
              <b-form-invalid-feedback v-if="errors.social_link">{{ errors.social_link[0]
              }}</b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="لینک وبسایت" label-for="website_link">
              <b-form-input id="website_link" v-model="form.website_link" :state="!errors.website_link"
                placeholder="لینک وبسایت " />
              <b-form-invalid-feedback v-if="errors.website_link">{{ errors.website_link[0]
              }}</b-form-invalid-feedback>
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
        </b-row>

        <div class="mt-3">
          <b-button v-if="checkPermission(['portfolio_update'])" type="submit" :disabled="loader"
            variant="primary">ویرایش
            نمونه کار</b-button>
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
import Editor from '@/components/shared/editor.vue';
import Swal from "sweetalert2";
import { useRoute, useRouter } from 'vue-router'
import { useAdmin } from '@/stores/modules/admin';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
let loader = ref(false);
const store = useAdmin();
const router = useRouter();
const checkPermission = store.checkPermission;
const route = useRoute();
const oldImage = ref([]);
const oldVideo = ref([]);

const form = reactive({
  title: '',
  image: '',
  video: '',
  meta_title: '',
  meta_description: '',
  description: '',
  social_link: '',
  website_link: '',
  images: [],
  category_id: null,
  employer_id: null
})
const errors = reactive({})
onMounted(async () => {

  try {
    // GET اطلاعات عضو
    const res = await axios.get(`/portfolios/${route.params.id}`)

    oldImage.value =
      [{
        name: res.data.data.image.split('/').pop(),
        size: 0,
        type: 'image/jpeg',
        ext: res.data.data.image.split('.').pop(),
        url: `${baseImageAddress}${res.data.data.image}`,
      }];

    oldVideo.value =
      [{
        name: res.data.data.video.split('/').pop(),
        size: 0,
        type: 'video/*',
        ext: res.data.data.video.split('.').pop(),
        url: `${baseImageAddress}${res.data.data.video}`,
      }];

    Object.assign(form, res.data.data);
    fetchInit();

  } catch (err) {
    console.log(err);
    toast.error('خطا در دریافت اطلاعات نمونه کار ❌')
  }
})
function imageFinder(path) {
  return baseImageAddress + path
}
async function fetchInit() {
  try {
    const { data } = await axios.get('/portfolio-categories');
    categories.value = data.data;
    let res = await axios.get('/employers');
    employers.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
}

const categories = ref([]);
const employers = ref([]);
const normalizer = (node) => {
  return {
    id: node.id,
    label: node.title_fa,
  }
}
const normalizer1 = (node) => {
  return {
    id: node.id,
    label: node.full_name,
  }
}
function imageLoaded(files) {
  if (files.length) {
    form.image = files[0].file
  } else {
    form.image = '';
  }
}
function imagesLoaded(files) {
  form.images = files.map((file) => file.file)
}
function videoLoaded(files) {
  if (files.length) {
    form.video = files[0].file
  } else {
    form.video = '';
  }

}

const handleSubmit = async () => {
  loader.value = true;
  Object.keys(errors).forEach(k => delete errors[k])
  try {
    const formData = new FormData()
    for (const key in form) {
      if (key === 'images') {
        form.images.forEach(imgfile => {
          formData.append("images[]", imgfile)
        })
      }
      else if (key != 'image' && key != 'video') formData.append(key, form[key])
    }

    formData.append("_method", "PUT");
    if (form.image) {
      formData.append("image", form.image);
    }
    if (form.video) {
      formData.append("video", form.video);
    }
    await axios.post(`/portfolios/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.success('نمونه کار با موفقیت ویرایش شد ✅');
    setTimeout(() => {
      router.push('/portfolios/list');
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
const deleteImage = (id, index) => {
  Swal.fire({
    title: "حذف تصویر از نمونه کار",
    text: "آیا مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const fd = new FormData();
        fd.append('imageId', id)
        await axios.post(`/portfolios/${route.params.id}/delete-image/`, fd);
        Swal.fire("موفق", "تصویر نمونه کار حذف شد", "success");
        form.images.splice(index, 1)
      } catch (err) {
        Swal.fire("خطا", "مشکلی در حذف پیش آمد", "error");
      }
    }
  });
};
</script>
<style>
div#oldImagesBox div.imageHolder {
  position: relative;
}

div#oldImagesBox button {
  position: absolute;
  left: 4px;
  top: 4px;
  background-color: unset;
  color: red;
  outline: unset;
  transition: all 0.8s;
}

div#oldImagesBox button:hover {
  border: 1px solid red;
}

div#oldImagesBox img {
  width: 100%;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

div#oldImagesBox {
  height: 160px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
}
</style>