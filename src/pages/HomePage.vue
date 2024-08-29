<script lang="ts">
import HomeHeader from '../components/header/HomeHeader.vue'
import SearchBody from '@/components/search-body/SearchBody.vue'
import { defineComponent, watch } from 'vue'
import { useParamsStore } from '@/stores/params-store'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'HomePage',
    components: {
        HomeHeader,
        SearchBody
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const paramsStore = useParamsStore()
        const params = paramsStore.$state

        watch(params, (newFilterParams) => {

            const searchParams: Record<string, string> = {}
            const currentParams = router.currentRoute.value.query
            const { searchQuery, categories } = newFilterParams

            if (searchQuery) {
                searchParams.searchQuery = searchQuery
            }

            if (categories.length > 0) {
                searchParams.categories = encodeURIComponent(JSON.stringify(categories))
                console.log(categories);
                console.log(searchParams.categories);
                
                
            }

            // if current params equal new params, we don't need to update
            if(JSON.stringify(currentParams.query) === JSON.stringify(searchParams)) {
                return
            }

            router.push({
                path: '/',
                query: searchParams
            })
        })

        watch(route, (newRoute) => {

            const { query } = newRoute
            const params = paramsStore.$state

            // if current params equal new params, we don't need to update
            if(JSON.stringify(params) === JSON.stringify(query)) {
                return
            }

            if (query.searchQuery !== params.searchQuery) {
                paramsStore.setSearchQuery(query.searchQuery as string)
            }

            if (query.categories) {
                paramsStore.setCategories(JSON.parse(query.categories as string))
            }
        }, { immediate: true, deep: true })
    }
})
</script>

<template>
    <HomeHeader />
    <SearchBody />
</template>
