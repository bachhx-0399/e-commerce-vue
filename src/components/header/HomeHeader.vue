<script lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '../../custom-hooks/use-debounce'
import { useParamsStore } from '../../stores/params-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const paramsStore = useParamsStore()
    const searchQuery = ref(paramsStore.searchQuery)
    const debouncedSearchQuery = useDebounce(searchQuery, 1000)

    watch(debouncedSearchQuery, (newValue) => {            
      paramsStore.setSearchQuery(newValue)
    })

    return {
      searchQuery,
      t
    }
  }
})
</script>

<template>
  <header
    class="header-backgound bg-black-600 flex h-96 md:h-[450px] w-full flex-col items-center justify-center bg-auto py-8 md:px-0 lg:p"
  >
    <p class="flex justify-center">
      <a href="https://www.algolia.com/">
        <img
          src="/images/algolia.svg"
          :width="92"
          :height="24"
          :alt="t('algolia_header_icon_alt')"
        />
      </a>
    </p>
    <p class="my-9 flex justify-center font-thin text-white md:text-3xl lg:text-5xl">
      {{ t('header_title') }}
    </p>
    <div class="w-5/6 lg:w-1/3">
      <div
        class="relative top-32 flex h-14 w-full items-center overflow-hidden rounded-lg bg-white shadow-xl backdrop-blur-lg focus-within:shadow-lg md:top-0 md:shadow-none md:blur-none"
      >
        <div class="grid h-full w-12 place-items-center text-yellow-400">
          <img src="/images/search.svg" class="size-6" :alt="t('search_header_icon_alt')" />
        </div>
        <input
          class="peer size-full pr-2 text-sm text-gray-700 outline-none placeholder:text-gray-300"
          type="text"
          id="search"
          v-model="searchQuery"
          :placeholder="t('header_search_placeholder')"
        />
      </div>
    </div>
  </header>
</template>
