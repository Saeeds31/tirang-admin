<template>
    <div class="p-4">
        <b-card title="ایجاد نمونه کار جدید">
            <b-form @submit.prevent="submitForm">
                <b-row>
                    <b-col cols="12" md="12">
                        <b-form-group label="عنوان" label-for="title">
                            <b-form-input id="title" v-model="form.title" :state="!errors.title" placeholder="عنوان " />
                            <b-form-invalid-feedback v-if="errors.title">{{ errors.title[0]
                            }}</b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group label="تصویر ">
                            <VueFileAgent @select="imageLoaded" :maxFiles="1" accept=".jpg,.png" theme="grid" deletable
                                sortable />
                        </b-form-group>
                        <small v-if="errors.image" class="text-danger">{{ errors.image[0] }}</small>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group label="ویدیو">
                            <VueFileAgent @select="videoLoaded" :maxFiles="1" accept=".mp4,.mkv" theme="grid" deletable
                                sortable />
                        </b-form-group>
                        <small v-if="errors.video" class="text-danger">{{ errors.video[0] }}</small>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group label="دسته‌بندی " label-for="category_id">
                            <Treeselect id="category_id" :multiple="false" v-model="form.category_id"
                                :normalizer="normalizer" :options="categories" placeholder="انتخاب دسته‌بندی "
                                :clearable="true" :valueConsistsOf="'ALL'" />
                            <small class="text-danger" v-if="errors.category_id">{{ errors.category_id[0]
                            }}</small>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-form-group label="کارفرما" label-for="category_id">
                            <Treeselect id="employer_id" :multiple="false" v-model="form.employer_id"
                                :normalizer="normalizer1" :options="employers" placeholder="انتخاب کارفرما "
                                :clearable="true" :valueConsistsOf="'ALL'" />
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

                    <b-col cols="12">
                        <b-form-group label="تصاویر">
                            <VueFileAgent @select="imagesLoaded" :multiple="true" accept=".jpg,.png,.pdf" theme="grid"
                                deletable sortable />
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
                            <b-form-textarea v-model="form.meta_description" :state="!errors.meta_description"
                                rows="2" />
                            <b-form-invalid-feedback v-if="errors.meta_description">{{ errors.meta_description[0]
                                }}</b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                </b-row>

                <div class="mt-3">
                    <b-button v-if="checkPermission(['portfolio_store'])" :disabled="loader" type="submit"
                        variant="primary">ذخیره</b-button>
                </div>
            </b-form>
        </b-card>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Editor from '@/components/shared/editor.vue';
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton, BCard, BRow, BCol, BFormInvalidFeedback } from 'bootstrap-vue-3';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import { useAdmin } from '@/stores/modules/admin';
import { useRouter } from 'vue-router';
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
const store = useAdmin();
const router = useRouter();
let loader = ref(false);
const checkPermission = store.checkPermission;
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
function imageLoaded(files) {
    form.image = files[0].file
}
function videoLoaded(files) {
    form.video = files[0].file
}

const submitForm = async () => {
    loader.value = true;
    Object.keys(errors).forEach(key => delete errors[key])
    try {
        const formData = new FormData()

        for (const key in form) {
            if (key === 'images') {
                form.images.forEach(imgfile => {
                    formData.append("images[]", imgfile)
                })
            } else {
                formData.append(key, form[key] ?? '')
            }
        }
        await axios.post('/portfolios', formData)
        toast.success('نمونه کار با موفقیت ذخیره شد ✅');
        setTimeout(() => {
            router.push('/portfolios/list');
        }, 1500);
    } catch (err) {
        if (err.response && err.response.status === 422) {
            Object.assign(errors, err.response.data.errors)
            toast.error('لطفاً خطاهای فرم را بررسی کنید ❌')
        } else {
            toast.error('خطا در ارسال اطلاعات ❌')
        }
    } finally {
        loader.value = false;

    }
}
const categories = ref([]);
const employers = ref([]);
function imagesLoaded(files) {
    form.images = files.map((file) => file.file)
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
onMounted(() => {
    fetchInit();
})
</script>