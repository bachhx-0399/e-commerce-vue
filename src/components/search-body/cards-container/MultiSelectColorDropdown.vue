<script lang="ts">
import HighlightField from '@/components/commons/highlight/HighlightField.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import { useDebounce } from '@/custom-hooks/use-debounce'
import { ENV } from '@/consts/env.const'
import { MAX_LENGTH_OF_SEARCH_BY_COLOR } from '@/consts/search-by-color.const'
import { type ColorProps } from '@/types/color.type'

export default {
    name: 'MultiSelectColorDropdown',
    components: {
        HighlightField
    },
    setup() {
        const { t } = useI18n()
        const paramsStore = useParamsStore()
        const searchTerm = ref<string>('')
        const debouncedSearchTerm = useDebounce(searchTerm, 300)
        const fetchedColors = ref<ColorProps[]>([])
        const filteredColors = ref<ColorProps[]>([])
        const isOpen = ref(false)
        const loading = ref<boolean>(true)
        const isError = ref<string | null>(null)
        const colorsList = computed(() => paramsStore.$state.colorsList)
        const colorSearchTerm = computed(() => paramsStore.$state.colorSearch)

        const toggleDropdown = () => {
            isOpen.value = !isOpen.value
        }

        const clearSelection = () => {
            paramsStore.setColorsList([])
        }

        const toggleColor = (color: string) => {
            if (!colorsList.value.includes(color)) {
                paramsStore.setColorsList([...colorsList.value, color])
            } else {
                paramsStore.setColorsList(colorsList.value.filter((c) => c !== color))
            }
        }

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/colors`)
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'))
                }
                const data = await response.json()
                fetchedColors.value = data
            } catch (error) {
                isError.value = (error as Error).message
            } finally {
                loading.value = false
            }
        }

        const selectedColors = computed(() => {
            if (colorsList.value.length > 0) {
                const selectedColors = colorsList.value.join(', ')
                return selectedColors.length > MAX_LENGTH_OF_SEARCH_BY_COLOR
                    ? `${selectedColors.slice(0, MAX_LENGTH_OF_SEARCH_BY_COLOR)}...`
                    : selectedColors
            } else {
                return t('select_color')
            }
        })

        const closeDropdown = () => {
            isOpen.value = false
        }

        onMounted((): void => {
            fetchData()
        })

        watch(
            colorSearchTerm,
            (colorSearchTerm) => {
                searchTerm.value = colorSearchTerm
            },
            { immediate: true }
        )

        watch(debouncedSearchTerm, (debouncedSearchTerm) => {
            paramsStore.setColorSearch(debouncedSearchTerm)
        })

        watch(
            [debouncedSearchTerm, fetchedColors],
            ([newDebouncedSearchTerm, newFetchedColors]) => {
                const newFilteredColors = newDebouncedSearchTerm
                    ? newFetchedColors.filter((color) =>
                        color.name.toLowerCase().includes(newDebouncedSearchTerm.toLowerCase())
                    )
                    : newFetchedColors
                filteredColors.value = newFilteredColors
            }
        )

        return {
            t,
            toggleDropdown,
            clearSelection,
            toggleColor,
            closeDropdown,
            isOpen,
            loading,
            isError,
            searchTerm,
            filteredColors,
            colorsList,
            selectedColors
        }
    }
}
</script>

<template>
    <div class="relative text-xs text-opacity-70 font-normal max-w-64 w-full">
        <div v-if="loading">{{ t('loading_ellipsis') }}</div>
        <div v-else-if="isError">{{ t('error') }}: {{ isError }}</div>
        <template v-else>
            <div class="cursor-pointer flex items-center justify-between w-fit bg-gray-100 min-w-24"
                @click="toggleDropdown">
                <span class="overflow-ellipsis max-w-36">{{ selectedColors }}</span>
                <img src="/images/down-arrow-svgrepo-com.svg" class="size-[10px]" :alt="t('open_dropdown')" />
            </div>

            <div v-if="isOpen" class="absolute border mt-1 bg-white rounded shadow w-full min-w-48 z-30">
                <input type="text" v-model="searchTerm" class="w-full box-sizing: border-box border-b min-h-6 px-2 mt-2"
                    :placeholder="t('search_color')" />

                <ul class="max-h-40 overflow-auto">
                    <li v-for="color in filteredColors" :key="color.name" class="p-2">
                        <label class="flex items-center">
                            <input type="checkbox" class="mr-2" :value="color"
                                :checked="colorsList.includes(color.name)" @change="toggleColor(color.name)" />
                            <HighlightField :text="color.name" :searchTerm="searchTerm" />
                        </label>
                    </li>
                </ul>

                <div class="flex justify-between p-2 pr-6 mt-3">
                    <button class="p-2 text-white rounded bg-red-400 hover:bg-red-500" @click="toggleDropdown">
                        {{ t('close') }}
                    </button>
                    <button class="p-2 text-white rounded bg-red-400 hover:bg-red-500" @click="clearSelection">
                        {{ t('clear_color') }}
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>
