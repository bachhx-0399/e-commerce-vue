<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCartStore } from "@/stores/cart-store";
import { type CartItemInterface } from "@/types/cart-item.type";

export default defineComponent({
  name: "CartTooltip",
  setup(props, { emit }) {
    const { t } = useI18n();
    const cartStore = useCartStore();
    const cartItems = computed(() => cartStore.$state.cart);
    const isCheckedAll = computed(() =>
      cartItems.value.every((item) => item.isChecked === true)
    )

    const formatCurrency = (value: number) => {
      return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    };

    const totalItems = ref(
      cartItems.value.reduce((sum, item) => sum + item.product.price, 0)
    );

    const totalPrice = computed(() =>
      cartItems.value.reduce((sum, item) => {
        if (!item.isChecked) return sum
        return sum + item.product.price * item.amount;
      }, 0)
    );

    const closeCart = (): void => {
      emit("update:modelValue", false);
    };

    const increaseAmount = (cartItem: CartItemInterface) => {
      const newCartItem: CartItemInterface = {
        product: cartItem.product,
        amount: cartItem.amount + 1,
        isChecked: cartItem.isChecked
      };
      cartStore.addToCart(newCartItem);
    };

    const decreaseAmount = (cartItem: CartItemInterface) => {
      if (cartItem.amount <= 0) return

      let isChecked = cartItem.isChecked
      if (cartItem.amount - 1 <= 0) {
        isChecked = false
      }
      const newCartItem: CartItemInterface = {
        product: cartItem.product,
        amount: cartItem.amount - 1,
        isChecked: isChecked
      };
      cartStore.addToCart(newCartItem);
    };

    const removeFromCart = (cartItem: CartItemInterface) => {
      cartStore.removeFromCart(cartItem);
    };

    const cartItemChecked = (cartItem: CartItemInterface) => {
      let amount = cartItem.amount
      let isChecked = !cartItem.isChecked

      if (amount == 0 && isChecked === true) {
        amount = 1
      }

      const newCartItem: CartItemInterface = {
        product: cartItem.product,
        amount: amount,
        isChecked: isChecked
      };
      cartStore.addToCart(newCartItem);
    };

    const checkAll = () => {
      if (isCheckedAll.value == true) {
        cartStore.ucheckedAllCartItems()
      } else {
        cartStore.checkedAllCartItems()
      }
    };

    return {
      t,
      formatCurrency,
      closeCart,
      increaseAmount,
      decreaseAmount,
      removeFromCart,
      cartItemChecked,
      checkAll,
      isCheckedAll,
      cartItems,
      totalItems,
      totalPrice,
    };
  },
});
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <!-- Tooltip Cart Info -->
    <div class="bg-white p-6 rounded-lg w-[90%] md:w-[60%] max-h-[90vh]">
      <div v-if="cartItems.length" class="mb-4">
        <h3 class="text-lg font-semibold mb-4 flex justify-between p-2">
          <span class="font-semibold">Giỏ hàng của bạn</span>
          <button class="flex items-center gap-2 bg-gray-300 px-3 py-1 hover:bg-gray-400 rounded">Payment <img src="/images/payment-card-svgrepo-com.svg" alt="" class="w-5 h-5"></button>
        </h3>
        <div class="max-h-[60vh] px-4 relative overflow-y-scroll">
          <table class="min-w-full bg-white sticky top-0">
            <thead class="bg-gray-700 whitespace-nowrap table-fixed">
              <tr>
                <th class="pl-4 w-8">
                  <input id="checkbox" type="checkbox" class="hidden peer" @change="checkAll" :checked="isCheckedAll" />
                  <label for="checkbox"
                    class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-gray-50 w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden">
                    <img src="/images/check-box-svgrepo-com.svg" alt="Checkbox">
                  </label>
                </th>
                <th class="p-4 text-left text-sm font-medium text-white">Image</th>
                <th class="p-4 text-left text-sm font-medium text-white">Name</th>
                <th class="p-4 text-left text-sm font-medium text-white">Đơn giá</th>
                <th class="p-4 text-left text-sm font-medium text-white">Amount</th>
                <th class="p-4 text-left text-sm font-medium text-white">Price</th>
                <th class="p-4 text-left text-sm font-medium text-white">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cartItems" :key="item.product.name" class="even:bg-blue-50 mb-2">
                <td class="pl-4 w-8">
                  <input type="checkbox" class="hidden peer" :id="item.product.name" :checked="item.isChecked"
                    @click="cartItemChecked(item)" />
                  <label :for="item.product.name"
                    class="relative flex items-center justify-center p-0.5 peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-gray-50 w-5 h-5 cursor-pointer bg-blue-500 border border-gray-400 rounded overflow-hidden">
                    <img src="/images/check-box-svgrepo-com.svg" alt="Checkbox">
                  </label>
                </td>
                <td class="p-4 cursor-pointer">
                  <img :src="item.product.image" alt="Product Image" class="w-12 h-12 object-cover rounded" />
                </td>
                <td class="p-4 text-sm max-w-60 cursor-pointer">
                  {{ item.product.name }}
                </td>
                <td class="p-4 text-sm">
                  {{ formatCurrency(item.product.price) }}
                </td>
                <td class="p-4 text-sm">
                  <div class="flex items-center">
                    <button class="bg-gray-300 px-3 py-1 hover:bg-gray-400" @click="decreaseAmount(item)">-</button>
                    <span class="px-4 min-w-16 text-center">x{{ item.amount }}</span>
                    <button class="bg-gray-300 px-3 py-1 hover:bg-gray-400" @click="increaseAmount(item)">+</button>
                  </div>
                </td>
                <td class="p-4 text-sm min-w-32">
                  {{ formatCurrency(item.product.price * item.amount) }}
                </td>
                <td class="p-4 text-sm">
                  <div class="flex justify-center items-center h-full hover:text-red-600">
                    <button @click="removeFromCart(item)">Xóa</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t mt-2 pt-6 flex justify-between">
          <span class="text-xl font-semibold ">Tổng cộng:</span>
          <span class="text-xl font-bold text-green-600">{{ formatCurrency(totalPrice) }}</span>
        </div>
      </div>
      <div v-else class="mb-4">
        <p class="text-center text-gray-500">Giỏ hàng của bạn trống</p>
      </div>
      <!-- Close Button -->
      <div class="flex justify-end">
        <button class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded" @click="closeCart">
          {{ t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>
