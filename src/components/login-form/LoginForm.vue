<script lang="ts">
import { defineComponent, ref } from 'vue'
import InputField from './InputField.vue'
import Button from './Button.vue'
import Logo from './Logo.vue'

export default defineComponent({
    components: {
        InputField,
        Button,
        Logo
    },
    setup() {
        const email = ref('')
        const password = ref('')
        const handleSubmit = () => {
            console.log('Logging in with:', email.value, password.value)
        }

        return {
            handleSubmit,
            email,
            password            
        }
    }
})
</script>

<template>
    <div class="bg-white p-8 rounded-lg shadow-md w-80">
        <Logo />
        <h2 class="text-2xl font-bold text-yellow-700 mb-6 text-center">Login</h2>
        <form @submit.prevent="handleSubmit">
            <InputField v-model="email" label="Email" type="email" placeholder="Enter your email" />
            <InputField
                v-model="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
            />
            <Button type="submit" text="Login" />
        </form>
    </div>
</template>
