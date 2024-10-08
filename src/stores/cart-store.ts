// Cart Store
import { defineStore } from 'pinia';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/utils/local-storage.utils';
import { LOCALSTORAGE_CART_KEY } from '@/consts/cart.const';
import { type CartItemInterface } from '@/types/cart-item.type';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: JSON.parse(getLocalStorage(LOCALSTORAGE_CART_KEY) || '[]') as CartItemInterface[],
    }),

    actions: {
        addToCart(cartItem: CartItemInterface) {
            // push and ovewrite the same item
            const cartItemIndex = this.cart.findIndex((item) => item.product.name === cartItem.product.name);
            if (cartItemIndex !== -1){
                this.cart[cartItemIndex] = cartItem
            } else {
                this.cart.push(cartItem);
            }
            setLocalStorage(LOCALSTORAGE_CART_KEY, JSON.stringify(this.cart));
        },

        removeFromCart(cartItem: CartItemInterface) {
            this.cart = this.cart.filter((item) => item.product.name !== cartItem.product.name);
            setLocalStorage(LOCALSTORAGE_CART_KEY, JSON.stringify(this.cart));
        },

        clearCart() {
            removeLocalStorage(LOCALSTORAGE_CART_KEY);
            this.cart = [];
        },
        checkedAllCartItems() {
            this.cart.forEach((item) => item.isChecked = true);
        },
        ucheckedAllCartItems() {
            this.cart.forEach((item) => item.isChecked = false);
        }
    }
})
