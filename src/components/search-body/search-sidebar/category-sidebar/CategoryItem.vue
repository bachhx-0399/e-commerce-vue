<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import type { CategoryProps } from '@/types/category.type'

export default defineComponent({
    name: 'CategoryList',
    props: {
        categories: {
            type: Array as () => CategoryProps[],
            required: true
        },
        parentPath: {
            type: Array as () => string[],
            required: true
        }
    },
    setup(props) {
        const { t } = useI18n()
        const { categories, parentPath } = props
        const paramsStore = useParamsStore()
        const updatedCategories = ref<CategoryProps[]>([])
        const paramsCategories = computed(() => paramsStore.$state.categories)

        watch(
            [categories, paramsCategories, parentPath],
            () => {
                const newCategories = categories.map((category) => {
                    const fullPath = [...parentPath, category.name]
                    const isActive = paramsCategories.value.includes(category.name)
                    return { ...category, fullPath, isActive }
                })

                updatedCategories.value = newCategories
            },
            { immediate: true }
        )

        const onCategoryClick = (fullPath: string[]) => {
            paramsStore.setCategories(fullPath)
        }

        return {
            t,
            updatedCategories,
            onCategoryClick
        }
    }
})
</script>

<template>
    <ul class="ml-3.5">
        <li v-for="(category, index) in updatedCategories" :key="index">
            <div
                class="container m-0 flex cursor-pointer items-center space-x-2 p-0 pb-4"
                @click="onCategoryClick(category.fullPath || [])"
                role="presentation"
            >
                <img
                    :src="category.isActive ? '/images/caret-down.svg' : '/images/caret-up.svg'"
                    :alt="category.isActive ? t('collapse') : t('expan')"
                    height="8"
                    width="8"
                />
                <span
                    class="text-sm leading-5"
                    role="presentation"
                    :style="{ fontWeight: category.isActive ? 'bold' : 'normal' }"
                    >{{ category.name }}</span
                >
                <span
                    class="ml-2 rounded bg-[#41424714] px-1 font-sans text-[11px] font-medium"
                    :style="{ fontWeight: category.isActive ? 'bold' : 'normal' }"
                >
                    {{ category.count }}
                </span>
            </div>
            <CategoryList
                v-if="category.subCategory.length > 0 && category.isActive"
                :categories="category.subCategory"
                :parentPath="category.fullPath || []"
            />
        </li>
    </ul>
</template>
