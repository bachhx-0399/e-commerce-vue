<script lang="ts">
import CustomOption from '@/components/commons/custom-option/CustomOption.vue'
import { defineComponent, type PropType } from 'vue'
import type { CustomSelectProps } from '@/types/custom-select.type'

export default defineComponent({
    name: 'CustomSelect',
    components: {
        CustomOption
    },
    props: {
        options: {
            type: Array as PropType<CustomSelectProps['options']>,
            required: true
        },
        rest: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        }
    }
})
</script>

<template>
    <select
        class="block w-full text-xs font-normal opacity-70 focus:border-indigo-500 focus:ring-indigo-500"
        v-bind="rest"
    >
        <CustomOption v-for="(option, index) in options" :key="index" :value="option.value">
            {{ option.label }}
        </CustomOption>
    </select>
</template>
