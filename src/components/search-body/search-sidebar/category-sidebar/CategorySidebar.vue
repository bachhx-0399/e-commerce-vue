<script lang="ts">
import CategoryItem from './CategoryItem.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENV } from '@/consts/env.const'
import { SIDEBAR_TEXT_COLOR } from '@/consts/sidebar.const'
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
            isError,
            SIDEBAR_TEXT_COLOR
        }
    }
})
</script>

<template>
    <div class="container m-0 border-b-2 border-inherit px-0 py-8">
        <div :class="`text-[${SIDEBAR_TEXT_COLOR}] pb-4 font-serif text-[18px] font-semibold leading-4`">
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
