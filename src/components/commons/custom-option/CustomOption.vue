<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { CustomOptionProps } from '@/types/custom-option.type'

export default defineComponent({
    name: 'CustomOption',
    props: {
        value: {
            type: String as PropType<CustomOptionProps['value']>,
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
    <option
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        :value="value"
        v-bind="rest"
    >
        <slot></slot>
    </option>
</template>
