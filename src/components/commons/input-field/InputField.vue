<script>
import { defineComponent } from 'vue'
// export default {
//     props: ['label', 'type', 'placeholder', 'modelValue'],
//     emits: ['update:modelValue']
// }
export default defineComponent({
    name: 'InputField',
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        modelValue: {
            type: String
        }
    }
})
</script>

<template>
    <div class="mb-4">
        <label class="block text-yellow-700 text-sm font-bold mb-2" :for="label">{{ label }}</label>
        <input
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            :type="type"
            :placeholder="placeholder"
            v-model="modelValue"
        />
    </div>
</template>
