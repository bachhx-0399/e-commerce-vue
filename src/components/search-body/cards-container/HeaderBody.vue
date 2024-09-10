<script lang="ts">
import CustomSelect from '@/components/commons/custom-select/CustomSelect.vue'
import MultiSelectColorDropdown from './MultiSelectColorDropdown.vue'
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'

export default defineComponent({
    name: 'HeaderBody',
    components: {
        CustomSelect,
        MultiSelectColorDropdown
    },
    setup() {
        const { t } = useI18n()
        const paramsStore = useParamsStore()
        const sortBy = computed(() => paramsStore.$state.sortBy)
        const hitsPerPage = computed(() => paramsStore.$state.hitsPerPage)

        const handleSortChange = (event: Event) => {
            const target = event.target as HTMLSelectElement
            paramsStore.setSortBy(target.value)
        }

        const handleHitsPerPageChange = (event: Event) => {
            const target = event.target as HTMLSelectElement
            paramsStore.setHitsPerPage(Number(target.value))
        }

        return {
            t,
            handleSortChange,
            handleHitsPerPageChange,
            sortBy,
            hitsPerPage
        }
    }
})
</script>

<template>
    <div class="flex min-h-16 md:min-h-20 items-center justify-end">
        <div class="h-4 w-28 rounded-md focus:outline-none">
            <CustomSelect
                :value="sortBy || 'instant_search'"
                :options="[
                    { label: t('sort_by_featured'), value: 'instant_search' },
                    { label: t('price_ascending'), value: 'instant_search_price_asc' },
                    { label: t('price_descending'), value: 'instant_search_price_desc' }
                ]"
                @change="handleSortChange"
            />
        </div>
        <div class="ml-12 h-4 w-28 rounded-md focus:outline-none">
            <MultiSelectColorDropdown />
        </div>
        <div class="ml-12 h-4 w-28 rounded-md focus:outline-none">
            <CustomSelect
                :value="hitsPerPage || 16"
                :options="[
                    { label: t('16_hits_per_page'), value: '16' },
                    { label: t('32_hits_per_page'), value: '32' },
                    { label: t('64_hits_per_page'), value: '64' }
                ]"
                @change="handleHitsPerPageChange"
            />
        </div>
    </div>
</template>
