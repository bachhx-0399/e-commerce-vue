<script lang="ts">
import CategoryItem from './CategoryItem.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENV } from '@/consts/env.const'
import type { CategoryProps } from '@/types/category.type'

export default defineComponent({
    name: 'CategorySidebar',
    components: {
        CategoryItem
    },
    setup() {
        const { t } = useI18n()
        const categories = ref<CategoryProps[]>([])
        const loading = ref<boolean>(true)
        const isError = ref<string | null>(null)

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/categories`)
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'))
                }
                const data = await response.json()
                categories.value = data
            } catch (error) {
                isError.value = (error as Error).message
            } finally {
                loading.value = false
            }
        }

        onMounted(fetchData)

        return {
            t,
            categories,
            loading,
            isError
        }
    }
})
</script>

<template>
    <div class="container m-0 border-b-2 border-inherit px-0 py-8 flex-grow-1">
        <div class="pb-4 font-serif text-[12px] font-semibold leading-4 text-[#21243d]">
            {{ t('category') }}
        </div>
        <div class="container m-0 p-0">
            <template v-if="loading">{{ t('loading_ellipsis') }}</template>
            <template v-else-if="isError">{{ t('error') }}: {{ isError }}</template>
            <template v-else>
                <CategoryItem :categories="categories" :parentPath="[]" />
            </template>
        </div>
    </div>
</template>
