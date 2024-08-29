<script lang="ts">
import HighlightField from '../../../commons/highlight/HighlightField.vue'
import { defineComponent, type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import { type CardProps } from '@/types/card.type'

export default defineComponent({
    name: 'CardItem',
    components: {
        HighlightField
    },
    props: {
        card: {
            type: Object as PropType<CardProps>,
            required: true
        }
    },
    setup(props) {
        const { t } = useI18n()
        const { image, name, description, price, categories, rating } = props.card
        const paramsStore = useParamsStore()
        const searchTerm = computed(() => paramsStore.$state.searchQuery)

        return {
            t,
            image,
            name,
            description,
            price,
            categories,
            rating,
            searchTerm
        }
    }
})
</script>

<template>
    <div
        class="max-w-sm overflow-hidden sm:hover:bg-gray-100 sm:hover:shadow-lg sm:hover:w-[calc(100%+32px)] sm:hover:h-[calc(100%+32px)] sm:hover:p-4 sm:hover:scale sm:hover:rounded-lg md:transition md:duration-300 sm:hover:scale-105 sm:hover:z-10"
    >
        <header class="flex aspect-square items-center justify-center">
            <img class="max-w-[174px]" :src="image" :alt="name" />
        </header>
        <div class="m-0 p-0">
            <div class="mb-2 mt-3 text-xs font-semibold uppercase text-[#21243d] opacity-70">
                {{ categories[0] || t('do_not_have_category') }}
            </div>
            <h1>
                <span class="text-sm font-bold leading-5 text-[#21243d]">
                    <HighlightField :text="name" :searchTerm="searchTerm" class="font-bold" />
                </span>
            </h1>
            <p class="mb-3.5 mt-0.5 text-sm leading-5">
                <HighlightField :text="description" :searchTerm="searchTerm" :truncate="true" />
            </p>
            <footer>
                <p class="flex items-center space-x-1 text-[14px] leading-5">
                    <span class="text-yellow-500">$</span>
                    <strong>{{ price }}</strong>
                    <span
                        class="mx-1 box-border inline-flex size-auto items-center gap-1 rounded-sm border border-yellow-500 px-1 text-[11px] text-yellow-500"
                    >
                        <img src="/images/start.svg" class="size-2" :alt="t('rating_score')" />
                        {{ rating }}
                    </span>
                </p>
            </footer>
        </div>
    </div>
</template>
