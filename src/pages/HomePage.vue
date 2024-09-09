<script lang="ts">
import HomeHeader from '../components/header/HomeHeader.vue'
import SearchBody from '@/components/search-body/SearchBody.vue'
import { defineComponent, watch } from 'vue'
import { useParamsStore } from '@/stores/params-store'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { MIN_PRICE, MAX_PRICE } from '@/consts/price-range-const'

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
            const { searchQuery, categories, brands, priceRangeValue, freeShipping, rating } = newFilterParams

            if (searchQuery) {
                searchParams.searchQuery = searchQuery
            }

            if (categories.length > 0) {
                searchParams.categories = encodeURIComponent(JSON.stringify(categories.join('/')));
            }

            if (brands.length > 0) {
                searchParams.brands = encodeURIComponent(JSON.stringify(brands.join(',')));
            }

            const [min, max] = priceRangeValue;
            if (min !== MIN_PRICE || max !== MAX_PRICE) {
                searchParams.price = `${min}-${max}`;
            }

            if (freeShipping) {
                searchParams.free_shipping = "true";
            }

            if (rating) {
                searchParams.rating = rating.toString();
            }

            // if current params equal new params, we don't need to update
            if (JSON.stringify(currentParams.query) === JSON.stringify(searchParams)) {
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
            if (JSON.stringify(params) === JSON.stringify(query)) {
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
            
            const priceRangeQueryString = query.price as string | undefined
            if (priceRangeQueryString) {
                const [min, max] = priceRangeQueryString.split('-').map((num) => parseInt(num))                
                paramsStore.setPriceRangeValue([min, max])
            } else {
                paramsStore.setPriceRangeValue([MIN_PRICE, MAX_PRICE])
            }

            if (query.free_shipping) {
                paramsStore.setFreeShipping(true)
            } else {
                paramsStore.setFreeShipping(false)
            }

            const rating = query.rating as string | undefined
            if (rating) {
                paramsStore.setRating(parseInt(rating))
            }else {
                paramsStore.setRating(undefined)
            }

        }, { immediate: true, deep: true })
    }
})
</script>

<template>
    <HomeHeader />
    <SearchBody />
</template>
