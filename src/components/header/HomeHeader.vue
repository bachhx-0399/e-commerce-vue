<script lang="ts">
import localLangConst from '@/consts/local-lang.const'
import { computed, ref, watch } from 'vue'
import { useDebounce } from '../../custom-hooks/use-debounce'
import { useParamsStore } from '../../stores/params-store'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login-store'

export default defineComponent({
  setup() {
    const { locale, t } = useI18n()
    const router = useRouter()
    const paramsStore = useParamsStore()
    const loginStore = useLoginStore()
    const searchQuery = ref(paramsStore.$state.searchQuery)
    const isLoggedIn = computed(() => loginStore.$state.isLoggedIn);
    const currentLanguage = ref('en');
    const cartItems = ref([]);
    const debouncedSearchQuery = useDebounce(searchQuery, 300)
    const isOpen = ref(false);

    // Current language and flag
    const currentFlag = computed(() => {
      return localLangConst[locale.value as keyof typeof localLangConst]?.image || '';
    });
    const currentLangName = computed(() => {
      return localLangConst[locale.value as keyof typeof localLangConst]?.t_name || '';
    });

    const toggleLogin = () => {
      if (isLoggedIn.value === true) {
        loginStore.logout();
      }

      router.push({ path: '/login' })
    };

    const goToCart = () => {
      // Check is logged in
      if (isLoggedIn.value === true) {
        router.push({ path: '/cart' })
      } else {
        router.push({ path: '/login' })
        alert(t('please_login_first'))
      }
    }

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };
    const selectLanguage = (langCode: string) => {
      locale.value = langCode;
      isOpen.value = false;
    };

    watch(debouncedSearchQuery, (newValue) => {
      searchQuery.value = newValue
      paramsStore.setSearchQuery(newValue)
    })

    watch(() => paramsStore.$state.searchQuery, (newParams) => {
      searchQuery.value = newParams
    })

    return {
      t,
      toggleLogin,
      goToCart,
      toggleDropdown,
      selectLanguage,
      searchQuery,
      isLoggedIn,
      currentLanguage,
      cartItems,
      localLangConst,
      isOpen,
      currentFlag,
      currentLangName,
    }
  }
})
</script>

<template>
  <header
    class="header-backgound bg-black-600 flex h-96 md:h-[450px] w-full flex-col items-center justify-center bg-auto py-8 md:px-0 lg:p">
    <div class="fixed top-0 left-0 right-0 flex justify-end items-center p-4 shadow-md w-full z-20">
      <div class="flex items-center gap-5">
        <!-- Language Switch with Flags -->
        <div class="relative inline-block text-left">
          <div>
            <button @click="toggleDropdown"
              class="inline-flex justify-center items-center w-full hover:bg-gray-300 bg-gray-200 p-2 rounded-md">
              <img :src="currentFlag" alt="flag" class="h-4 w-4 mr-2" />
              {{ t(currentLangName) }}
              <i class="fas fa-chevron-down ml-2"></i>
            </button>
          </div>

          <div v-if="isOpen"
            class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div class="py-1">
              <button v-for="(lang, key) in localLangConst" :key="key" @click="selectLanguage(key)"
                class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-yellow-100 w-full text-left h-10">
                <img :src="lang.image" alt="flag" class="h-4 w-4" />
                {{ t(lang.t_name) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cart -->
        <button @click="goToCart" class="flex gap-2 hover:bg-gray-300 min-w-[40px] bg-gray-200 h-10 rounded-md p-2">
          <img src="/images/cart-xmark-svgrepo-com.svg" class="size-6" :alt="t('cart_header_icon_alt')" />
          <span>{{ cartItems.length }}</span>
        </button>

        <!-- Login/Logout -->
        <button @click="toggleLogin" class="hover:bg-gray-300 min-w-[90px] bg-gray-200 h-10 rounded-md p-2">
          {{ isLoggedIn ? t('logout') : t('login') }}
        </button>
      </div>
    </div>
    <p class="flex justify-center">
      <a href="https://www.algolia.com/">
        <img src="/images/algolia.svg" :width="92" :height="24" :alt="t('algolia_header_icon_alt')" />
      </a>
    </p>
    <p class="my-9 flex justify-center font-thin text-white md:text-3xl lg:text-5xl">
      {{ t('header_title') }}
    </p>
    <div class="w-5/6 lg:w-1/3">
      <div
        class="relative top-32 flex h-14 w-full items-center overflow-hidden rounded-lg bg-white shadow-xl backdrop-blur-lg focus-within:shadow-lg md:top-0 md:shadow-none md:blur-none">
        <div class="grid h-full w-12 place-items-center text-yellow-400">
          <img src="/images/search.svg" class="size-6" :alt="t('search_header_icon_alt')" />
        </div>
        <input class="peer size-full pr-2 text-sm text-gray-700 outline-none placeholder:text-gray-300" type="text"
          id="search" v-model="searchQuery" :placeholder="t('header_search_placeholder')" />
      </div>
    </div>
  </header>
</template>
