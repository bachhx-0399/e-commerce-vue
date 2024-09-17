<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useParamsStore } from '@/stores/params-store'

export default defineComponent({
    name: 'PaginationContainer',
    setup() {
        const pages = ref([] as number[])
        const paramsStore = useParamsStore()
        const currentPage = computed(() => paramsStore.$state.currentPage)
        const totalPages = computed(() => paramsStore.$state.totalPages)

        watch([currentPage, totalPages], () => {
            const maxPagesToShow = 5
            let startPage = Math.max(1, currentPage.value - 2)
            let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1)

            if (currentPage.value > totalPages.value - 3) {
                startPage = Math.max(1, totalPages.value - 4)
                endPage = totalPages.value
            }

            const newPages = []
            for (let i = startPage; i <= endPage; i += 1) {
                newPages.push(i)
            }

            pages.value = newPages
        }, { immediate: true, deep: true })

        const handlePageChange = (page: number) => {
            paramsStore.setCurrentPage(page)
        }

        return {
            currentPage,
            totalPages,
            pages,
            handlePageChange
        }
    }
})
</script>

<template>
    <div class="my-16 flex items-center justify-center space-x-1">
        <button
            class="px-5 py-1"
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            type="button"
        >
            &lt;
        </button>

        <button
            v-for="page in pages"
            :key="page"
            class="rounded-sm border px-3 py-1"
            :class="{
                'bg-yellow-400 text-white': page === currentPage,
                'bg-gray-100 text-gray-700': page !== currentPage
            }"
            @click="handlePageChange(page)"
            type="button"
        >
            {{ page }}
        </button>

        <button
            class="px-5 py-1"
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            type="button"
        >
            &gt;
        </button>
    </div>
</template>
