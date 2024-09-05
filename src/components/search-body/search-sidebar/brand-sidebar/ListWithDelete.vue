<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useParamsStore } from '@/stores/params-store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ListWithDelete',
  setup() {
    const { t } = useI18n()
    const paramsStore = useParamsStore()
    const brands = computed(() => paramsStore.$state.brands)

    const deleteItem = (brandName: String): void => {
      paramsStore.setBrands(brands.value.filter((brand) => brand !== brandName))
    }

    return {
      t,
      deleteItem,
      brands
    }
  }
})
</script>

<template>
  <div class="container p-4 pl-0 w-full md:max-w-[320px]">
    <ul class="flex flex-wrap gap-2">
      <li v-for="(brand, index) in brands" :key="index"
        class="w-fit flex items-center bg-gray-100 rounded-lg px-2 py-1 shadow-sm">
        <span class="text-gray-800 mr-2">{{ brand }}</span>
        <button class="text-gray-600 hover:text-red-500 focus:outline-none" @click="deleteItem(brand)">
          <img src="/images/brand-delete.svg" :alt="t('delete_icon')" />
        </button>
      </li>
    </ul>
  </div>
</template>
