<script lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import { defineComponent, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import { useCardsStore } from '@/stores/cards-store'
import { useDebounce } from '@/custom-hooks/use-debounce'
import { SELECTED_RANGE_COLOR, STEP } from '@/consts/price-range-const'
import { SIDEBAR_TEXT_COLOR } from '@/consts/sidebar.const'
import { priceRoundUp, priceRoundDown } from '@/utils/price-round.utils'

export default defineComponent({
    name: 'PriceSidebar',
    components: {
        VueSlider
    },
    setup() {
        const { t } = useI18n()
        const paramsStore = useParamsStore()
        const cardsStore = useCardsStore()
        const filteredPriceRangeValue = computed(() => paramsStore.$state.priceRangeValue)
        const maxPriceInRange = computed(() => priceRoundUp(cardsStore.$state.maxPrice))
        const minPriceInRange = computed(() => priceRoundDown(cardsStore.$state.minPrice))
        const priceRangeValue = ref<number[]>([minPriceInRange.value, maxPriceInRange.value])
        const debouncedPriceRangeValue = useDebounce(priceRangeValue, 300)

        watch(
            [maxPriceInRange, minPriceInRange],
            (
                [newMaxPriceInRange, newMinPriceInRange],
                [oldMaxPriceInRange, oldMinPriceInRange]
            ) => {
                let [newMinPriceVal, newMaxPriceVal] = priceRangeValue.value

                if (newMinPriceVal <= newMinPriceInRange || newMinPriceVal === oldMinPriceInRange) {
                    newMinPriceVal = newMinPriceInRange
                }

                if (newMaxPriceVal >= newMaxPriceInRange || newMaxPriceVal === oldMaxPriceInRange) {
                    newMaxPriceVal = newMaxPriceInRange
                }

                const newPriceRangeValue = [newMinPriceVal, newMaxPriceVal]
                paramsStore.setPriceRangeValue(newPriceRangeValue)
            }
        )

        const clearAllPriceRange = (): void => {
            paramsStore.setPriceRangeValue([minPriceInRange.value, maxPriceInRange.value])
        }

        watch(debouncedPriceRangeValue, (newDebouncedPriceRangeValue) => {
            paramsStore.setPriceRangeValue(newDebouncedPriceRangeValue)
        })

        watch(filteredPriceRangeValue, (newFilteredPriceRangeValue) => {
            priceRangeValue.value = newFilteredPriceRangeValue
        })

        return {
            t,
            clearAllPriceRange,
            priceRangeValue,
            minPriceInRange,
            maxPriceInRange,
            STEP,
            SELECTED_RANGE_COLOR,
            SIDEBAR_TEXT_COLOR
        }
    }
})
</script>

<template>
    <div class="container m-0 border-b-2 border-inherit px-0 py-8">
        <div
            :class="`text-[${SIDEBAR_TEXT_COLOR}] flex justify-between items-center pb-4 font-serif text-[18px] font-semibold leading-4`"
        >
            <span class="font-semibold">{{ t('price') }}</span>
            <button
                class="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center gap-2"
                @click="clearAllPriceRange"
            >
                <img class="size-4" src="/images/reload.svg" :alt="t('delete_icon')" />
                {{ t('clear_price') }}
            </button>
        </div>
        <div class="container relative m-0 flex flex-col justify-start p-0">
            <VueSlider
                v-model="priceRangeValue"
                :min="minPriceInRange"
                :max="maxPriceInRange"
                :step="STEP"
                :dot-style="{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }"
                :process-style="{
                    backgroundColor: SELECTED_RANGE_COLOR
                }"
                :height="2"
                tooltip="none"
            />
            <div class="mt-2 flex justify-between text-sm">
                <span> <span class="text-yellow-500">$</span>{{ priceRangeValue[0] }} </span>
                <span> <span class="text-yellow-500">$</span>{{ priceRangeValue[1] }} </span>
            </div>
        </div>
    </div>
</template>
