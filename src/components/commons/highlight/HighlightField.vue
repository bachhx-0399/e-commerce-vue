<script lang="ts">
import { computed, defineComponent } from 'vue'
import { type HighlightProps } from '@/types/highlight-field.type'

export default defineComponent({
    name: 'HighlightField',
    props: {
        text: {
            type: String,
            required: true
        },
        searchTerm: {
            type: String,
            default: ''
        },
        truncate: {
            type: Boolean,
            default: false
        },
        truncateLength: {
            type: Number,
            default: 100
        }
    },
    setup(props: HighlightProps, { attrs }) {

        const truncateText = (rawText: string) => {
            if (rawText.length <= props.truncateLength) {
                return rawText
            }
            return `${rawText.slice(0, props.truncateLength)}...`
        }

        const parts = computed(() => {
            return props.searchTerm
                ? props.text.split(new RegExp(`(${props.searchTerm})`, 'gi'))
                : []
        })

        const truncatedParts = computed(() => {
            if (props.searchTerm && props.truncate) {
                const highlightIndex = parts.value.findIndex(
                    (part) => part.toLowerCase() === props.searchTerm.toLowerCase()
                )

                if (highlightIndex === -1) {
                    return []
                }

                const beforeHighlight = parts.value.slice(0, highlightIndex).join('')
                const afterHighlight = parts.value.slice(highlightIndex + 1).join('')
                const truncatedText = `${beforeHighlight.length > 20 ? '...' : ''}${beforeHighlight.slice(-20)}${parts.value[highlightIndex]}${afterHighlight.slice(0, 20)}${afterHighlight.length > 20 ? '...' : ''}`
                return truncatedText.split(new RegExp(`(${props.searchTerm})`, 'gi'))
            }
            return []
        })

        const truncatedText = computed(() => {
            return props.truncate ? truncateText(props.text) : props.text
        })        

        return {
            parts,
            truncatedParts,
            truncatedText,
            attrs
        }
    }
})
</script>

<template>
    <span v-bind="attrs">
        <template v-if="searchTerm && truncatedParts.length">
            <template v-for="(part, index) in truncatedParts" :key="index">
                <mark v-if="part.toLowerCase() === searchTerm.toLowerCase()" v-bind="attrs">{{
                    part
                }}</mark>
                <span v-else v-bind="attrs">{{ part }}</span>
            </template>
        </template>
        <template v-else-if="searchTerm">
            <template v-for="(part, index) in parts" :key="index">
                <mark v-if="part.toLowerCase() === searchTerm.toLowerCase()" v-bind="attrs">{{
                    part
                }}</mark>
                <span v-else v-bind="attrs">{{ part }}</span>
            </template>
        </template>
        <template v-else>
            {{ truncatedText }}
        </template>
    </span>
</template>
