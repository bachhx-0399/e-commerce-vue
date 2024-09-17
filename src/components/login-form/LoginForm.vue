<script lang="ts">
import InputField from '@/components/commons/input-field/InputField.vue'
import CustomButton from '@/components/commons/button/CustomButton.vue'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLoginStore } from '@/stores/login-store'
import { useRouter } from 'vue-router'
import { ENV } from '@/consts/env.const'

export default defineComponent({
    components: {
        InputField,
        CustomButton,
    },
    setup() {
        const { t } = useI18n()
        const loginStore = useLoginStore()
        const router = useRouter()
        const email = ref('')
        const password = ref('')
        const emailError = ref<string | undefined>(undefined)
        const passwordError = ref<string | undefined>(undefined)

        const validateEmail = (email: string) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        const fetchUserData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/users?email=${email.value}&password=${password.value}`)
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'))
                }
                const data = await response.json()
                if (data.length > 0) {
                    loginStore.login()
                    router.push({ path: '/' })
                } else {
                    alert(t('user_not_found'))

                }
            } catch (error) {
                alert((error as Error).message)
            }
        }

        const handleSubmit = () => {
            let newEmailError = undefined
            let newPasswordError = undefined

            if (!email.value) {
                newEmailError = t('email_is_required')
            } else if (!validateEmail(email.value)) {
                newEmailError = t('invalid_email_format')
            }

            if (!password.value) {
                newPasswordError = t('password_is_required')
            } else if (password.value.length < 6) {
                newPasswordError = t('password_must_be_at_least_6_characters')
            }

            if (!newEmailError && !newPasswordError) {
                fetchUserData()
            }

            emailError.value = newEmailError
            passwordError.value = newPasswordError
        }

        return {
            t,
            handleSubmit,
            email,
            password,
            emailError,
            passwordError
        }
    }
})
</script>

<template>
    <div class="bg-yellow-50 p-8 rounded-lg shadow-md">
        <div class="flex justify-center mb-4 bg-yellow-700 rounded-full p-4">
            <img
                src="/images/algolia.svg"
                :width="92"
                :height="24"
                :alt="t('algolia_header_icon_alt')"
            />
        </div>
        <h2 class="text-2xl font-bold text-yellow-700 mb-6 text-center">Login</h2>
        <form @submit.prevent="handleSubmit">
            <InputField v-model="email" label="Email" type="email" placeholder="Enter your email" :error="emailError" />

            <InputField v-model="password" label="Password" type="password" placeholder="Enter your password"
                :error="passwordError" />

            <CustomButton type="submit" text="Login" />
        </form>
    </div>

</template>
