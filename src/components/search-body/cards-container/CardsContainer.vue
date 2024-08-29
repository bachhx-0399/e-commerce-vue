<script lang="ts">
import CardItem from './card-item/CardItem.vue'
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENV } from '@/consts/env.const'
import { useParamsStore } from '@/stores/params-store'
import { type CardProps } from '@/types/card.type'

export default defineComponent({
    name: 'MainBody',
    components: {
        CardItem
    },
    setup() {
        const { t } = useI18n()
        const loading = ref<boolean>(true)
        const isError = ref<string | null>(null)
        const cards = ref<CardProps[]>([])
        const filteredCards = ref<CardProps[]>([])
        const filterParams = useParamsStore().$state

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/cards`)
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'))
                }
                const data = await response.json()
                cards.value = data
                filteredCards.value = data
            } catch (error) {
                isError.value = (error as Error).message
            } finally {
                loading.value = false
            }
        }

        onMounted((): void => {
            fetchData()
        })

        watch(
            filterParams,
            (newFilterParams): void => {
                if (newFilterParams.searchQuery !== undefined) {
                    const lowerCaseQuery = newFilterParams.searchQuery.toLowerCase()
                    filteredCards.value = cards.value.filter((card): boolean => {
                        const lowerCaseName = card.name.toLowerCase()
                        const lowerCaseDescription = card.description.toLowerCase()

                        return (
                            lowerCaseName.includes(lowerCaseQuery) ||
                            lowerCaseDescription.includes(lowerCaseQuery)
                        )
                    })
                }
            },
            { immediate: true, deep: true }
        )

        return {
            loading,
            isError,
            cards,
            filteredCards,
            t
        }
    }
})
</script>

<template>
    <div class="container m-0 max-w-[948px] p-0">
        <header class="border-b-2 border-inherit p-0">Body header</header>
        <div v-if="loading">{{ t('loading_ellipsis') }}</div>
        <div v-else-if="isError">{{ t('error') }}: {{ isError }}</div>
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CardItem v-for="(card, index) in filteredCards" :key="index" :card="card" />
        </div>
        <div class="fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center">
            <button
                class="flex h-9 w-24 items-center gap-2 rounded bg-yellow-500 px-2 py-0.5 font-bold text-white shadow-lg shadow-gray-300 backdrop-blur-lg md:hidden"
                @click="$emit('toggle-sidebar')"
            >
                <img class="h-6 w-6" src="/images/filter.svg" :alt="t('filter_icon')" />
                {{ t('filter') }}
            </button>
        </div>
    </div>
</template>
