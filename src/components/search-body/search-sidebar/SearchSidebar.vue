<script lang="ts">
import BrandSidebar from './brand-sidebar/BrandSidebar.vue'
import CategorySidebar from './category-sidebar/CategorySidebar.vue'
import RatingSidebar from './rating-sidebar/RatingSidebar.vue'
import PriceSidebar from './price-sidebar/PriceSidebar.vue'
import FreeShippingSidebar from './free-shipping-sidebar/FreeShippingSidebar.vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'

export default defineComponent({
    name: 'SearchSidebar',
    components: {
        BrandSidebar,
        CategorySidebar,
        RatingSidebar,
        PriceSidebar,
        FreeShippingSidebar
    },
    setup(props, { emit }) {
        const { t } = useI18n()
        const paramsStore = useParamsStore()    

        const handleOnClickResetFilters = (): void => {
            emit('toggle-sidebar')
            paramsStore.resetParams()
        }

        return {
            t,
            handleOnClickResetFilters
        }
    }
})
</script>

<template>
    <div class="container p-3 md:p-0 w-auto">
        <div class="container p-0 md:w-auto">Header placeholder</div>
        <div class="container flex w-auto flex-col p-0 py-8 md:w-auto mb-10 md:m-auto md:max-w-[300px]">
            <CategorySidebar />
            <BrandSidebar />
            <PriceSidebar />
            <FreeShippingSidebar />
            <RatingSidebar />
        </div>
        <div class="container fixed left-0 bottom-0 flex w-full items-center justify-center gap-3 md:hidden border-inherit border-t-2 py-5 bg-white">
            <button
                class="h-10 w-44 rounded-lg bg-gray-100 px-2 py-0.5 shadow-l"
                @click="handleOnClickResetFilters"
                type="button"
            >
                {{ t('reset_filters') }}
            </button>
            <button
                class="h-10 w-44 rounded-lg bg-yellow-500 px-2 py-0.5 text-white shadow-l"
                @click="$emit('toggle-sidebar')"
                type="button"
            >
            {{ t('see_results') }}
            </button>
        </div>
    </div>
</template>
