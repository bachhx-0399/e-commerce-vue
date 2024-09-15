<script lang="ts">
import { useI18n } from 'vue-i18n'
import { useParamsStore } from '@/stores/params-store'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'SidebarHeader',
    setup() {
        const { t } = useI18n()
        const paramsStore = useParamsStore()

        const resetFilters = () => {
            paramsStore.resetParams()
        }

        return {
            t,
            resetFilters
        }
    }
})
</script>

<template>
    <div class="flex min-h-20 items-center justify-between h-full border-b-2 border-inherit">
        <div class="container p-0">
            <h2 class="text-lg font-bold">{{ t('filter') }}</h2>
        </div>
        <div class="container items-center justify-end p-0 text-xs hidden md:flex">
            <button
                class="flex cursor-not-allowed items-center gap-2"
                @click="resetFilters"
                type="button"
            >
                <img src="/images/reload.svg" class="size-3" :alt="t('clear_filters')" />
                {{ t('clear_filters') }}
            </button>
        </div>
    </div>
</template>
