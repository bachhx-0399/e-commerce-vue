<script lang="ts">
import RatingStart from './RatingStar.vue';
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useParamsStore } from '@/stores/params-store';
import { ENV } from '@/consts/env.const';
import { SIDEBAR_TEXT_COLOR } from '@/consts/sidebar.const';
import type { RatingStartProps } from '@/types/rating-star.type';

export default defineComponent({
    name: 'RatingSidebar',
    components: {
        RatingStart,
    },
    setup() {
        const { t } = useI18n();
        const paramsStore = useParamsStore();
        const ratingData = ref<RatingStartProps[]>([]);
        const loading = ref<boolean>(true);
        const isError = ref<string | null>(null);

        const fetchData = async (): Promise<void> => {
            try {
                const response = await fetch(`${ENV.VITE_SERVER_DOMAIN}/ratings`);
                if (!response.ok) {
                    throw new Error(t('network_response_was_not_ok'));
                }
                const data = await response.json();
                ratingData.value = data.sort((a: RatingStartProps, b: RatingStartProps) => b.rating - a.rating);
            } catch (error) {
                isError.value = (error as Error).message;
            } finally {
                loading.value = false;
            }
        };

        const clearRating = (): void => {
            paramsStore.setRating(undefined);
        };

        onMounted(fetchData);

        return {
            t,
            clearRating,
            loading,
            isError,
            ratingData,
            SIDEBAR_TEXT_COLOR
        };
    },
});
</script>

<template>
    <div class="container m-0 px-0 py-8">
        <div
            :class="` text-[${SIDEBAR_TEXT_COLOR}] flex justify-between items-center pb-4 font-serif text-[18px] font-semibold leading-4`"
        >
            <span class="font-semibold">{{ t("ratings") }}</span>
            <button
                class="text-sm text-red-500 hover:text-red-700 focus:outline-none flex items-center gap-2"
                @click="clearRating"
            >
                <img class="size-4" src="/images/reload.svg" :alt="t('delete_icon')" />
                {{ t('clear_rating') }}
            </button>
        </div>
        <div class="container relative m-0 flex flex-col justify-start gap-3 p-0">
            <div v-if="loading">{{ t('loading_ellipsis') }}</div>
            <div v-else-if="isError">{{ t('error') }}: {{ isError }}</div>
            <RatingStart v-for="rating in ratingData" :key="rating.rating" v-bind="{ ...rating }" />
        </div>
    </div>
</template>
