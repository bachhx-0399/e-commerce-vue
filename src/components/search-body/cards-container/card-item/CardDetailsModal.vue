<script lang="ts">
import { computed, toRefs, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cart-store';
import { type CardProps } from '@/types/card.type';
import type { CartItemInterface } from '@/types/cart-item.type';

export default {
    name: 'CardDetailsModal',
    props: {
        product: {
            type: Object as PropType<CardProps>,
            required: true,
        },
    },
    setup(props) {
        const { t } = useI18n();
        const cartStore = useCartStore();
        const { product } = toRefs(props);
        const productInCart = computed(() => {
            return cartStore.$state.cart.find((item) => JSON.stringify(item.product) === JSON.stringify(product.value))
        })
        const amount = computed(() => {
            return cartStore.$state.cart.find((item) => JSON.stringify(item.product) === JSON.stringify(product.value))?.amount || 0;
        })
        const isMinimize = computed(() => {
            return amount.value <= 0
        })

        const increaseAmount = () => {
            const newCartItem: CartItemInterface = {
                product: product.value,
                amount: amount.value + 1,
                isChecked: productInCart.value?.isChecked || true
            };
            cartStore.addToCart(newCartItem);
        };

        const decreaseAmount = () => {
            if (amount.value <= 0) return

            let isChecked = productInCart.value?.isChecked || false
            if (amount.value - 1 <= 0) {
                isChecked = false
            }
            const newCartItem: CartItemInterface = {
                product: product.value,
                amount: amount.value - 1,
                isChecked: isChecked
            };
            cartStore.addToCart(newCartItem);
        };

        const removeFromCart = () => {
            const newCartItem: CartItemInterface = { product: product.value, amount: amount.value, isChecked: false };
            cartStore.removeFromCart(newCartItem);
        };

        const addToCart = () => {
            const newCartItem: CartItemInterface = { product: product.value, amount: 1, isChecked: true };
            cartStore.addToCart(newCartItem);
        };

        return {
            t,
            increaseAmount,
            decreaseAmount,
            removeFromCart,
            addToCart,
            productInCart,
            amount,
            isMinimize
        };
    },
};
</script>

<template>
    <!-- Modal -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg w-[90%] md:w-[40%] max-h-[80vh] overflow-y-auto">
            <!-- Modal content -->
            <h2 class="text-xl font-bold mb-4">{{ product.name }}</h2>
            <div class="flex justify-center items-center my-8">
                <img :src="product.image" alt="product image" class="w-full md:w-[300px] h-auto mb-4 rounded-md" />
            </div>
            <p class="text-gray-700 mb-4">{{ product.description }}</p>

            <div class="mb-4">
                <strong>{{ t('category') }}:</strong>
                <ul class="list-disc pl-6">
                    <li v-for="category in product.categories" :key="category">{{ category }}</li>
                </ul>
            </div>

            <div class="flex justify-between mb-4">
                <div class="flex gap-2">
                    <strong>{{ t('price') }}:</strong>
                    <span class="text-green-600">{{ product.price }}</span>
                </div>
                <div class="flex gap-2">
                    <strong>{{ t('ratings') }}:</strong>
                    <span class="text-yellow-500 flex gap-2 items-center">
                        {{ product.rating }}
                        <img src="/images/start.svg" class="size-[12px]" :alt="t('rating_score')" />
                    </span>
                </div>
            </div>

            <div class="mb-4 flex gap-2">
                <strong>{{ t('brands') }}:</strong>
                <span>{{ product.brand || t('unknown') }}</span>
            </div>

            <div class="mb-4 flex gap-2">
                <strong>{{ t('free_shipping') }}:</strong>
                <span>{{ product.free_shipping ? t('yes') : t('no') }}</span>
            </div>

            <div class="mb-4 flex gap-2">
                <strong>{{ t('popularity') }}:</strong>
                <span>{{ product.popularity }}</span>
            </div>

            <div class="mb-4 flex gap-2">
                <strong>{{ t('price_range') }}:</strong>
                <span>{{ product.price_range }}</span>
            </div>

            <!-- Quantity control -->
            <div class="flex items-center mb-4">
                <button :class="`${isMinimize ? 'bg-gray-400' : 'bg-gray-300'} px-3 py-1 hover:bg-gray-400`"
                    :disabled="isMinimize" @click="decreaseAmount">-</button>
                <span class="px-4">{{ amount }}</span>
                <button class="px-3 py-1 bg-gray-300 hover:bg-gray-400" @click="increaseAmount">+</button>
            </div>

            <div class="container flex justify-end gap-4 py-4">
                <!-- Add to Cart button -->
                <button
                    :class="`${productInCart ? 'bg-gray-500/[0.5]' : 'bg-green-500 hover:bg-green-600'} px-4 py-2 text-white rounded h-full`"
                    @click="addToCart">
                    {{ t('add_to_cart') }}
                </button>

                <!-- Remove from Cart button -->
                <button
                    :class="`${!productInCart ? 'bg-gray-500/[0.5]' : 'bg-blue-500 hover:bg-blue-600'} px-4 py-2 text-white rounded h-full`"
                    @click="removeFromCart">
                    {{ t('remove_from_cart') }}
                </button>

                <!-- Close button -->
                <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded h-full"
                    @click="$emit('closeModal')">
                    {{ t('close') }}
                </button>
            </div>
        </div>
    </div>
</template>
