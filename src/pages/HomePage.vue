<script lang="ts">
import HomeHeader from '../components/header/HomeHeader.vue'
import { defineComponent, watch } from 'vue'
import { useParamsStore } from '@/stores/params-store'
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'HomePage',
    components: {
        HomeHeader
    },
    setup() {
        const paramsStore = useParamsStore();
        const params = paramsStore.$state;
        const router = useRouter();

        watch(
            params,
            (newFilterParams) => {
                const searchParams: Record<string, string> = {};
                const { searchQuery } = newFilterParams;

                if (searchQuery) {
                    searchParams.query = searchQuery;
                }

                router.push({
                    path: '/',
                    query: searchParams
                })
            }
        );
    }
})
</script>

<template>
    <HomeHeader />
    <div class="container">
        Body
    </div>
</template>
