<template>
    <div class="p-4">
        <b-card title="ایجاد کارفرما جدید">
            <b-form @submit.prevent="submitForm">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group label="نام کامل" label-for="full_name">
                            <b-form-input id="full_name" v-model="form.full_name" :state="!errors.full_name"
                                placeholder="نام کامل کارفرما" />
                            <b-form-invalid-feedback v-if="errors.full_name">{{ errors.full_name[0]
                                }}</b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" md="6">
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
                        <b-form-group label="پروفایل کارفرما ">
                            <VueFileAgent @select="imageLoaded" :maxFiles="1" accept=".jpg,.png" theme="grid" deletable
                                sortable />
                        </b-form-group>
                        <small v-if="errors.image" class="text-danger">{{ errors.image[0] }}</small>
                    </b-col>
                    <b-col cols="12" md="12">
                        <b-form-group label="لوگو کسب و کار ">
                            <VueFileAgent @select="imageLoaded1" :maxFiles="1" accept=".jpg,.png" theme="grid" deletable
                                sortable />
                        </b-form-group>
                        <small v-if="errors.business_logo" class="text-danger">{{ errors.business_logo[0] }}</small>
                    </b-col>
                </b-row>

                <div class="mt-3">
                    <b-button v-if="checkPermission(['employer_store'])" :disabled="loader" type="submit"
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
import { BForm, BFormGroup, BFormInput, BButton, BCard, BRow, BCol, BFormInvalidFeedback } from 'bootstrap-vue-3'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { useAdmin } from '@/stores/modules/admin';
import { useRouter } from 'vue-router'
const store = useAdmin();
const router = useRouter();
let loader = ref(false);
const checkPermission = store.checkPermission;
const form = reactive({
    full_name: '',
    mobile: '',
    business_logo: '',
    business_label: '',
    image: '',
})
const errors = reactive({})
function imageLoaded(files) {
    form.image = files[0].file
}
function imageLoaded1(files) {
    form.business_logo = files[0].file
}
const submitForm = async () => {
    loader.value = true;
    Object.keys(errors).forEach(key => delete errors[key])
    try {
        const formData = new FormData()

        for (const key in form) {
            formData.append(key, form[key] ?? '')
        }
        await axios.post('/employers', formData)
        toast.success('کارفرما با موفقیت ذخیره شد ✅');
        setTimeout(() => {
            router.push('/users/employers/list');
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