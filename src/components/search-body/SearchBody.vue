<script lang="ts">
import CardsContainer from './cards-container/CardsContainer.vue'
import SearchSidebar from './search-sidebar/SearchSidebar.vue';
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
    name: 'SearchBody',
    components: {
        CardsContainer,
        SearchSidebar
    },
    setup() {
        const isSidebarOpen = ref<boolean>(false)

        const toggleSidebar = (): void => {
            isSidebarOpen.value = !isSidebarOpen.value
        }

        return {
            isSidebarOpen,
            toggleSidebar
        }
    }
})
</script>

<template>
    <div :class="`m-0 flex justify-center py-8 md:m-14 ${isSidebarOpen ? 'px-0' : 'px-4'}`">
        <main class="relative flex justify-center size-full space-x-3 md:h-auto md:min-h-screen">
            <div
                :class="`md:static md:z-0 md:mr-14 md:block md:size-auto md:flex-none md:border-none ${
                    isSidebarOpen ? '' : 'hidden'
                } absolute -top-72 z-20 h-fit w-full rounded-lg border-t-2 border-gray-300 bg-white`"
            >
                <SearchSidebar @toggle-sidebar="toggleSidebar" />
            </div>
            <section :class="`${!isSidebarOpen ? '' : 'hidden'} md:block`">
                <CardsContainer @toggle-sidebar="toggleSidebar" />
            </section>
        </main>
    </div>
</template>
