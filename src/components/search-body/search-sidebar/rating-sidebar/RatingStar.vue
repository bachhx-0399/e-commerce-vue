
<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useParamsStore } from '@/stores/params-store';
import type { RatingStartProps } from '@/types/rating-star.type';

export default defineComponent({
    name: 'RatingStart',
    props: {
        rating: {
            type: Number as () => RatingStartProps['rating'],
            required: true,
        },
        count: {
            type: Number as () => RatingStartProps['count'],
            required: true,
        },
    },
    setup(props: RatingStartProps) {
        const { t } = useI18n();
        const { rating } = toRefs(props);
        const paramsStore = useParamsStore();        
        const fullStars = computed(() => Math.floor(rating.value));
        const emptyStars = computed(() => 5 - fullStars.value);
        const selectedRating = computed(() => paramsStore.rating);

        const handleOnClick = () => {
            paramsStore.setRating(rating.value);
        };

        return {
            t,
            handleOnClick,
            fullStars,
            emptyStars,
            selectedRating,
        };
    }
});
</script>

<template>
    <ul :class="`flex items-center gap-2 ${selectedRating === rating ? 'opacity-100' : 'opacity-50'}`"
        @click="handleOnClick" role="presentation">
        <li v-for="(star, index) in fullStars" :key="'full-' + index" class="text-yellow-500">
            <img src="/images/yellow-start.svg" :alt="t('star')" class="size-7 md:size-8"/>
        </li>

        <li v-for="(star, index) in emptyStars" :key="'empty-' + index" class="text-gray-300">
            <img src="/images/white-start.svg" :alt="t('star')" class="size-7 md:size-8"/>
        </li>

        <span class="ml-2 rounded bg-[#41424714] px-1 font-sans tex-[12px] md:text-[14px] font-medium opacity-75">
            {{ count }}
        </span>
    </ul>
</template>
