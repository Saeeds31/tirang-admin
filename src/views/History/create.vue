<template>
    <div class="p-4">
        <b-card title="ایجاد تاریخچه جدید">
            <b-form @submit.prevent="submitForm">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group label="عنوان" label-for="title">
                            <b-form-input id="title" v-model="form.title" :state="!errors.title"
                                placeholder="عنوان تاریخچه" />
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



                    <!-- Image -->
                    <b-col cols="12" md="12">
                        <b-form-group label="تصویر ">
                            <VueFileAgent @select="imageLoaded" :maxFiles="1" accept=".jpg,.png" theme="grid" deletable
                                sortable />
                        </b-form-group>
                        <small v-if="errors.image" class="text-danger">{{ errors.image[0] }}</small>
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
                    <b-button v-if="checkPermission(['history_store'])" :disabled="loader" type="submit"
                        variant="primary">ذخیره</b-button>
                </div>
            </b-form>
        </b-card>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton, BCard, BRow, BCol, BFormInvalidFeedback } from 'bootstrap-vue-3'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { useAdmin } from '@/stores/modules/admin';
import { useRouter } from 'vue-router'
const store = useAdmin();
const router = useRouter();
let loader = ref(false);
const checkPermission = store.checkPermission;
const form = reactive({
    title: '',
    date: '',
    image: '',
    description: '',
})
const errors = reactive({})
function imageLoaded(files) {
    form.image = files[0].file
}
const submitForm = async () => {
    loader.value = true;
    Object.keys(errors).forEach(key => delete errors[key])
    try {
        const formData = new FormData()

        for (const key in form) {
            formData.append(key, form[key] ?? '')
        }
        await axios.post('/histories', formData)
        toast.success('تاریخچه با موفقیت ذخیره شد ✅');
        setTimeout(() => {
            router.push('/history/list');
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
</script>