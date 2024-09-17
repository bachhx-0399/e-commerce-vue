<script lang="ts">
import localLangConst from '@/consts/local-lang.const'
import getHintsTerm from '@/utils/get-hints-term.utils'
import HighlightField from '../commons/highlight/HighlightField.vue'
import { computed, defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useDebounce } from '../../custom-hooks/use-debounce'
import { useParamsStore } from '../../stores/params-store'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login-store'
import { useCartStore } from '@/stores/cart-store'
import { useCardsStore } from '@/stores/cards-store'

export default defineComponent({
    name: 'HomeHeader',
    components: {
        HighlightField
    },
    setup(props, { emit }) {
        const { locale, t } = useI18n()
        const router = useRouter()
        const paramsStore = useParamsStore()
        const loginStore = useLoginStore()
        const cartStore = useCartStore()
        const cardsStore = useCardsStore()
        const searchQuery = ref(paramsStore.$state.searchQuery)
        const isLoggedIn = computed(() => loginStore.$state.isLoggedIn)
        const currentLanguage = ref('en')
        const cartItems = computed(() => cartStore.$state.cart)
        const debouncedSearchQuery = useDebounce(searchQuery, 300)
        const cards = computed(() => cardsStore.$state.cards)
        const isOpen = ref(false)
        const highlightedIndex = ref(-1) // Index của mục được highlight

        // Current language and flag
        const currentFlag = computed(() => {
            return localLangConst[locale.value as keyof typeof localLangConst]?.image || ''
        })
        const currentLangName = computed(() => {
            return localLangConst[locale.value as keyof typeof localLangConst]?.t_name || ''
        })

        const toggleLogin = () => {
            if (isLoggedIn.value === true) {
                loginStore.logout()
            }

            router.push({ path: '/login' })
        }

        const goToCart = () => {
            // Check is logged in
            if (isLoggedIn.value === true) {
                emit('update:modelValue', true)
            } else {
                router.push({ path: '/login' })
                alert(t('please_login_first'))
            }
        }

        const toggleDropdown = () => {
            isOpen.value = !isOpen.value
        }
        const selectLanguage = (langCode: string) => {
            locale.value = langCode
            isOpen.value = false
        }

        const hints = computed(() => {
            const searchTerm = debouncedSearchQuery.value?.toLowerCase()
            if (!searchTerm) return []
            return getHintsTerm(searchTerm, cards.value)
        })

        const selectHint = (hint: string) => {
            searchQuery.value = hint
            paramsStore.setSearchQuery(hint)
        }

        // Xử lý sự kiện bàn phím
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown') {
                // Di chuyển xuống
                if (highlightedIndex.value < hints.value.length - 1) {
                    highlightedIndex.value++
                }
            } else if (event.key === 'ArrowUp') {
                // Di chuyển lên
                if (highlightedIndex.value > 0) {
                    highlightedIndex.value--
                }
            } else if (event.key === 'Enter') {
                // Chọn gợi ý khi nhấn Enter
                if (highlightedIndex.value !== -1) {
                    selectHint(hints.value[highlightedIndex.value])
                }
            }
        }

        watch(debouncedSearchQuery, (newValue) => {
            searchQuery.value = newValue
            paramsStore.setSearchQuery(newValue)
        })

        watch(
            () => paramsStore.$state.searchQuery,
            (newParams) => {
                searchQuery.value = newParams
            }
        )

        watch(hints, (newHints) => {
            if (newHints.length > 0) {
                highlightedIndex.value = 0
            }
        })

        // Lắng nghe sự kiện keydown khi component được mount
        onMounted(() => {
            window.addEventListener('keydown', handleKeydown)
        })

        // Loại bỏ sự kiện keydown khi component bị unmount
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleKeydown)
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
            hints, // Thêm phần gợi ý
            selectHint,
            highlightedIndex
        }
    }
})
</script>

<template>
    <header
        class="header-backgound bg-black-600 flex h-96 md:h-[450px] w-full flex-col items-center justify-center bg-auto py-8 md:px-0 lg:p"
    >
        <div
            class="fixed top-0 left-0 right-0 flex justify-end items-center p-4 shadow-md w-full z-20"
        >
            <div class="flex items-center gap-5">
                <!-- Language Switch with Flags -->
                <div class="relative inline-block text-left">
                    <div>
                        <button
                            @click="toggleDropdown"
                            class="inline-flex justify-center items-center w-full hover:bg-gray-300 bg-gray-200 p-2 rounded-md"
                        >
                            <img :src="currentFlag" alt="flag" class="h-4 w-4 mr-2" />
                            {{ t(currentLangName) }}
                            <i class="fas fa-chevron-down ml-2"></i>
                        </button>
                    </div>

                    <div
                        v-if="isOpen"
                        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                    >
                        <div class="py-1">
                            <button
                                v-for="(lang, key) in localLangConst"
                                :key="key"
                                @click="selectLanguage(key)"
                                class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-yellow-100 w-full text-left h-10"
                            >
                                <img :src="lang.image" alt="flag" class="h-4 w-4" />
                                {{ t(lang.t_name) }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Cart -->
                <button
                    @click="goToCart"
                    class="flex gap-2 hover:bg-gray-300 min-w-[40px] bg-gray-200 h-10 rounded-md p-2"
                >
                    <img
                        src="/images/cart-xmark-svgrepo-com.svg"
                        class="size-6"
                        :alt="t('cart_header_icon_alt')"
                    />
                    <span>{{ cartItems.length }}</span>
                </button>

                <!-- Login/Logout -->
                <button
                    @click="toggleLogin"
                    class="hover:bg-gray-300 min-w-[90px] bg-gray-200 h-10 rounded-md p-2"
                >
                    {{ isLoggedIn ? t('logout') : t('login') }}
                </button>
            </div>
        </div>
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
        <div class="w-5/6 lg:w-1/3 relative">
            <div
                class="relative top-32 flex h-14 w-full items-center overflow-hidden rounded-lg bg-white shadow-xl backdrop-blur-lg focus-within:shadow-lg md:top-0 md:shadow-none md:blur-none"
            >
                <div class="grid h-full w-12 place-items-center text-yellow-400">
                    <img
                        src="/images/search.svg"
                        class="size-6"
                        :alt="t('search_header_icon_alt')"
                    />
                </div>
                <input
                    class="peer size-full pr-2 text-sm text-gray-700 outline-none placeholder:text-gray-300"
                    type="text"
                    id="search"
                    v-model="searchQuery"
                    :placeholder="t('header_search_placeholder')"
                />
            </div>

            <!-- Hiển thị gợi ý tìm kiếm -->
            <ul
                v-if="hints.length"
                class="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto"
            >
                <li
                    v-for="(hint, index) in hints"
                    :key="hint"
                    :class="`${index === highlightedIndex ? 'bg-[#f5f5f5]' : ''}`"
                    class="px-4 py-2 text-gray-800 hover:bg-[#f5f5f5] cursor-pointer"
                    @click="selectHint(hint)"
                >
                    <HighlightField :text="hint" :search-term="searchQuery" />
                </li>
            </ul>
        </div>
    </header>
</template>
