<script lang="ts">
import BrandCheckbox from './BrandCheckbox.vue';
import ListWithDelete from './ListWithDelete.vue';
import { ref, onMounted, watch, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDebounce } from '@/custom-hooks/use-debounce';
import { useParamsStore } from '@/stores/params-store';
import { ENV } from '@/consts/env.const';
import { LIMIT_BRANDS } from '@/consts/brand.const';
import type { BrandProps } from '@/types/brand.type';

export default defineComponent({
    name: 'BrandSidebar',
    components: {
        BrandCheckbox,
        ListWithDelete
    },
    setup() {
        const { t } = useI18n();
        const paramsStore = useParamsStore();
        const searchValue = ref<string>('');
        const debouncedSearchValue = useDebounce(searchValue, 300);
        const fetchedBrands = ref<BrandProps[]>([]);
        const filteredBrands = ref<BrandProps[]>([]);
        const loading = ref<boolean>(true)
        const isError = ref<string | null>(null)

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/brands`);
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'));
                }
                const brandsData = await response.json();
                fetchedBrands.value = brandsData;
            } catch (error) {
                isError.value = (error as Error).message;
            } finally {
                loading.value = false;
            }
        };

        const clearAllBrands = (): void => {
            paramsStore.setBrands([])
        }

        onMounted((): void => {
            fetchData();
        });

        watch([debouncedSearchValue, fetchedBrands], ([newDebouncedSearchValue, newFetchedBrands]) => {

            const newFilteredBrands = newDebouncedSearchValue
                ? newFetchedBrands.filter((brd: BrandProps): boolean =>
                    brd.name.toLowerCase().includes(newDebouncedSearchValue.toLowerCase())
                )
                : newFetchedBrands;

            filteredBrands.value = newFilteredBrands.slice(0, LIMIT_BRANDS);

        }, { immediate: true });

        return {
            t,
            clearAllBrands,
            loading,
            isError,
            searchValue,
            filteredBrands
        }

    }
})
</script>

<template>
    <div class="container m-0 border-b-2 border-inherit px-0 py-8 flex-grow-1">
        <div
            class="flex justify-between items-center pb-4 font-serif text-[18px] font-semibold leading-4 text-[#21243d]"
        >
            <span>{{ t("brands") }}</span>
            <button
                class="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center gap-2"
                @click="clearAllBrands"
            >
                <img class="size-4" src="/images/reload.svg" :alt="t('delete_icon')" />
                {{ t('clear_brands') }}
            </button>
        </div>
        <div v-if="loading">{{ t('loading_ellipsis') }}</div>
        <div v-else-if="isError">{{ t('error') }}: {{ isError }}</div>
        <div v-else class="container relative m-0 flex flex-col justify-start p-0">
            <div>
                <div class="relative flex h-10 w-full items-center overflow-hidden rounded">
                    <div class="absolute bottom-0 left-0 grid h-full w-12 place-items-center">
                        <img src="/images/search.svg" class="size-3" :alt="t('search_header_icon_alt')" />
                    </div>
                    <input
                        class="peer size-full bg-neutral-700/[.06] px-11 py-1 text-sm font-normal text-[#21243D]/[.8] outline-0"
                        type="text" :placeholder="t('sidebar_search_branch_placeholder')" v-model="searchValue" />
                </div>
            </div>
            <div class="container">
                <ListWithDelete />
            </div>
            <div class="container flex flex-col p-0">
                <BrandCheckbox v-for="brand in filteredBrands" :key="brand.name" :label="brand.name"
                    :count="brand.count" :search-term="searchValue" />
            </div>
        </div>
    </div>
</template>
