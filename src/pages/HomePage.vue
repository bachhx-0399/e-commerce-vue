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
        const filterParams = paramsStore.$state

        watch(filterParams, (newFilterParams) => {

            const searchParams: Record<string, string> = {}
            const currentParams = router.currentRoute.value.query
            const { searchQuery, categories, brands } = newFilterParams            

            if (searchQuery) {
                searchParams.searchQuery = searchQuery
            }

            if (categories.length > 0) {                
                searchParams.categories = encodeURIComponent(JSON.stringify(categories.join('/')));
            }

            if (brands.length > 0) {
                searchParams.brands = encodeURIComponent(JSON.stringify(brands.join(',')));
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

            const categoriesQueryString = query.categories as string | undefined
            if (categoriesQueryString) {
                const categories = JSON.parse(decodeURIComponent(categoriesQueryString)).split('/')
                paramsStore.setCategories(categories)
            } else {
                paramsStore.setCategories([])
            }

            const brandsQueryString = query.brands as string | undefined
            if (brandsQueryString) {
                const brands = JSON.parse(decodeURIComponent(brandsQueryString)).split(',')
                paramsStore.setBrands(brands)
            } else {
                paramsStore.setBrands([])
            }

        }, { immediate: true, deep: true })
    }
})
</script>

<template>
    <HomeHeader />
    <SearchBody />
</template>
