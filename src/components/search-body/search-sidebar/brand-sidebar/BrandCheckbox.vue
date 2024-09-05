<script lang="ts">
import Highlight from '../../../commons/highlight/HighlightField.vue';
import { ref, watch, defineComponent, computed } from 'vue';
import { useParamsStore } from '@/stores/params-store';
import type { BrandCheckboxProps } from '@/types/brand-checkbox.type';

export default defineComponent({
    name: 'BrandCheckbox',
    components: {
        Highlight
    },
    props: {
        label: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        searchTerm: {
            type: String,
            default: ''
        }
    },
    setup(props: BrandCheckboxProps) {
        const paramsStore = useParamsStore();
        const filterBrands = computed(() => paramsStore.$state.brands);
        const isChecked = ref(filterBrands.value.includes(props.label));

        watch(
            filterBrands,
            (newBrands) => {
                isChecked.value = newBrands.includes(props.label);
            }
        );

        const handleToggle = () => {
            const currentBrands = paramsStore.$state.brands;
            if (isChecked.value) {
                paramsStore.setBrands(currentBrands.filter((brand) => brand !== props.label));
            } else {
                paramsStore.setBrands([...currentBrands, props.label]);
            }
            isChecked.value = !isChecked.value;
        };

        return {
            handleToggle,
            isChecked,
        }
    },
})
</script>

<template>
    <div class="inline-flex items-center">
        <label class="relative flex cursor-pointer items-center rounded-full p-3 pl-0">
            <input type="checkbox"
                class="peer relative size-5 cursor-pointer appearance-none rounded-sm border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:size-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-amber-500 checked:bg-amber-500 checked:before:bg-amber-500"
                :checked="isChecked" @change="handleToggle" />
            <span
                class="pointer-events-none absolute left-[32%] top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <img src="/images/dot.svg" alt="check" class="size-1.5 text-white" />
            </span>
        </label>
        <div class="container m-0 flex cursor-pointer items-center space-x-2 p-0" role="presentation">
            <span :class="['text-sm text-slate-800', isChecked ? 'font-bold' : 'font-medium']">
                <Highlight :text="label" :searchTerm="searchTerm || ''" />
            </span>
            <span class="ml-2 rounded bg-[#414247]/[.08] px-1 font-sans text-[11px] font-medium">
                {{ count }}
            </span>
        </div>
    </div>
</template>
