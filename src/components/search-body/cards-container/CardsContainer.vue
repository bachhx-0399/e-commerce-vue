<script lang="ts">
import CardItem from './card-item/CardItem.vue'
import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ENV } from '@/consts/env.const'
import { MIN_PRICE, MAX_PRICE } from '@/consts/price-range-const'
import { useParamsStore } from '@/stores/params-store'
import { useCardsStore } from '@/stores/cards-store'
import { type CardProps } from '@/types/card.type'

export default defineComponent({
    name: 'MainBody',
    components: {
        CardItem
    },
    setup() {
        const { t } = useI18n()
        const cardsStore = useCardsStore()
        const loading = ref<boolean>(true)
        const isError = ref<string | null>(null)
        const cards = computed<CardProps[]>(() => cardsStore.$state.cards)
        const filteredCards = computed<CardProps[]>(() => cardsStore.$state.filteredCards)
        const paramsStore = useParamsStore()
        const filterParams = paramsStore.$state

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/cards`)
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'))
                }
                const data = await response.json()
                cardsStore.setCards(data)
                cardsStore.setFilteredCards(data)
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
                const { searchQuery, categories, brands, priceRangeValue, rating, freeShipping } =
                    newFilterParams
                let newFilteredCards = cards.value

                if (searchQuery !== undefined && searchQuery !== '') {
                    const lowerCaseQuery = searchQuery.toLowerCase()
                    newFilteredCards = newFilteredCards.filter((card): boolean => {
                        const lowerCaseName = card.name.toLowerCase()
                        const lowerCaseDescription = card.description.toLowerCase()

                        return (
                            lowerCaseName.includes(lowerCaseQuery) ||
                            lowerCaseDescription.includes(lowerCaseQuery)
                        )
                    })
                }

                if (categories?.length) {
                    newFilteredCards = newFilteredCards.filter((crd) =>
                        categories.every((ctg) => crd.categories.includes(ctg))
                    )
                }

                if (brands?.length) {
                    newFilteredCards = newFilteredCards.filter((card) =>
                        brands.includes(card.brand as string)
                    )
                }

                if (freeShipping) {
                    newFilteredCards = newFilteredCards.filter((card) => card.free_shipping)
                }

                if (rating) {
                    newFilteredCards = newFilteredCards.filter((card) => card.rating >= rating)
                }

                cardsStore.setMaxPrice(newFilteredCards)

                const [min, max] = priceRangeValue
                if (min !== MIN_PRICE || max !== MAX_PRICE) {
                    newFilteredCards = newFilteredCards.filter(
                        (card) => card.price >= min && card.price <= max
                    )
                }

                cardsStore.setFilteredCards(newFilteredCards)
            },
            { immediate: true, deep: true }
        )

        return {
            loading,
            isError,
            filteredCards,
            t
        }
    }
})
</script>

<template>
    <div class="container m-0 max-w-[948px] p-0">
        <header class="hidden border-b-2 border-inherit p-0 md:block mb-5">Body header</header>
        <div v-if="loading">{{ t('loading_ellipsis') }}</div>
        <div v-else-if="isError">{{ t('error') }}: {{ isError }}</div>
        <div
            v-else-if="filteredCards.length > 0"
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            <CardItem v-for="(card, index) in filteredCards" :key="index" :card="card" />
        </div>
        <div v-else class="container grid grid-cols-1 gap-4 m-auto md:p-0 py-16 px-8">
            <div class="flex flex-col justify-center items-center w-full">
                <img
                    class="h-36 w-36 hidden md:block"
                    src="/images/not-found.svg"
                    :alt="t('search_icon')"
                />
                <p class="text-center text-2xl font-bold mt-6 max-w-[300px]">
                    {{ t('no_matches') }}
                </p>
                <p class="text-center text-sm font-light my-[14px]">{{ t('try_another_query') }}</p>
                <p class="invisible text-2xl font-bold">{{ t('no_matches') }}</p>
            </div>
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
