<template>
    <div class="p-4">
        <b-card title="ایجاد عضو جدید">
            <b-form @submit.prevent="submitForm">
                <b-row>
                    <b-col cols="12" md="6">
                        <b-form-group label="نام کامل" label-for="full_name">
                            <b-form-input id="full_name" v-model="form.full_name" :state="!errors.full_name"
                                placeholder="نام کامل عضو" />
                            <b-form-invalid-feedback v-if="errors.full_name">{{ errors.full_name[0]
                            }}</b-form-invalid-feedback>
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
                            <b-form-input v-model="form.sort_order" :state="!errors.sort_order" type="number"
                                placeholder="مثال: 5" />
                            <b-form-invalid-feedback v-if="errors.sort_order">{{ errors.sort_order[0]
                            }}</b-form-invalid-feedback>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" md="6">
                        <b-form-group label="شماره تماس ">
                            <b-form-input v-model="form.mobile" :state="!errors.mobile" type="tel"
                                placeholder="مثال: 5" />
                            <b-form-invalid-feedback v-if="errors.mobile">{{ errors.mobile[0]
                            }}</b-form-invalid-feedback>
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
                    <b-button v-if="checkPermission(['team_store'])" :disabled="loader" type="submit"
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
    full_name: '',
    post: '',
    mobile: '',
    sort_order: '',
    image: '',
    biography: '',
    show_in_home: 0
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
            if (key == 'show_in_home') {
                formData.append(key, Number(form[key]))
            } else {
                formData.append(key, form[key] ?? '')
            }
        }
        await axios.post('/teams', formData)
        toast.success('عضو با موفقیت ذخیره شد ✅');
        setTimeout(() => {
            router.push('/team/list');
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