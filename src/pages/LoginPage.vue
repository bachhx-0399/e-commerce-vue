<script lang="ts">
import LoginForm from '../components/login-form/LoginForm.vue';
import { onMounted } from 'vue';
import { useLoginStore } from '@/stores/login-store';
import { useRouter } from 'vue-router';

export default {
    components: {
        LoginForm,
    },
    setup() {
        const loginStore = useLoginStore()
        const router = useRouter()
        onMounted(() => {
            if (loginStore.isLoggedIn) {
                router.push({ path: '/' })
            }
        })
    },
};
</script>

<template>
    <div class="min-h-screen bg-yellow-100 flex justify-center items-center">
        <LoginForm />
    </div>
</template>
