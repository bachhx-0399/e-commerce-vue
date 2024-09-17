<script lang="ts">
import CardDetailsModal from './CardDetailsModal.vue'
import HighlightField from '../../../commons/highlight/HighlightField.vue'
import { defineComponent, ref, type PropType, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import { useCartStore } from '@/stores/cart-store'
import { SIDEBAR_TEXT_COLOR } from '@/consts/sidebar.const'
import { type CardProps } from '@/types/card.type'

export default defineComponent({
    name: 'CardItem',
    components: {
        CardDetailsModal,
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
        const paramsStore = useParamsStore()
        const cartStore = useCartStore()
        const isModalOpen = ref(false);
        const searchTerm = computed(() => paramsStore.$state.searchQuery)
        const image = computed(() => props.card.image)
        const name = computed(() => props.card.name)
        const description = computed(() => props.card.description)
        const price = computed(() => props.card.price)
        const categories = computed(() => props.card.categories)
        const rating = computed(() => props.card.rating)
        const productInCart = computed(() => {
            return cartStore.$state.cart.find((item) => JSON.stringify(item.product) === JSON.stringify(props.card))
        })
        const cartAmount = computed(() =>
            productInCart.value?.amount || 0
        );

        return {
            t,
            image,
            name,
            description,
            price,
            categories,
            rating,
            searchTerm,
            isModalOpen,
            cartAmount,
            productInCart,
            SIDEBAR_TEXT_COLOR
        }
    }
})
</script>

<template>
    <div class="group relative max-w-sm sm:hover:bg-gray-100 sm:hover:shadow-lg sm:hover:w-[calc(100%+32px)] sm:hover:h-[calc(100%+32px)] sm:hover:p-4 sm:hover:scale sm:hover:rounded-lg md:transition md:duration-300 sm:hover:scale-105 sm:hover:z-10 p-4"
        :class="`${productInCart ? 'border-2 border-yellow-500' : ''}`" @click="isModalOpen = true">
        <div v-if="productInCart"
            class="text-sm absolute top-0 right-0 flex items-center gap-2 border-l-2 border-b-2 border-yellow-500 text-yellow-500 p-1 rounded-sm">
            <span>{{ cartAmount }}</span>
            <img src="/images/cart-xmark-svgrepo-com-yellow.svg" class="size-4" :alt="t('cart_header_icon_alt')" />
        </div>
        <header class="flex aspect-square items-center justify-center">
            <img class="max-w-[174px]  " :src="image" :alt="name" />
        </header>
        <div class="m-0 p-0">
            <div :class="`text-[${SIDEBAR_TEXT_COLOR}] mb-2 mt-3 text-xs font-semibold uppercase opacity-70`">
                {{ categories[0] || t('do_not_have_category') }}
            </div>
            <h1>
                <span :class="`text-[${SIDEBAR_TEXT_COLOR}] text-sm font-bold leading-5`">
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
                        class="mx-1 box-border inline-flex size-auto items-center gap-1 rounded-sm border border-yellow-500 px-1 text-[11px] text-yellow-500">
                        <img src="/images/start.svg" class="size-2" :alt="t('rating_score')" />
                        {{ rating }}
                    </span>
                </p>
            </footer>
        </div>
        <div
            class="absolute bottom-0 left-[-85%] max-w-[200px] bg-gray-600 bg-opacity-50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 box-border">
            <p class="text-sm">{{ description }}</p>
        </div>
    </div>

    <CardDetailsModal v-if="isModalOpen" @closeModal="isModalOpen = false" :product="card" />
</template>
