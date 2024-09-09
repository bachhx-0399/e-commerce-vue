<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useParamsStore } from "@/stores/params-store";
import { SIDEBAR_TEXT_COLOR } from "@/consts/sidebar.const";

export default defineComponent({
    name: "FreeShippingSidebar",
    setup() {
        const { t } = useI18n();
        const paramsStore = useParamsStore();
        const freeShipping = computed(() => paramsStore.$state.freeShipping);

        const handleToggle = () => {
            paramsStore.setFreeShipping(!freeShipping.value);
        };

        return {
            t,
            handleToggle,
            freeShipping,
            SIDEBAR_TEXT_COLOR
        };
    },
});
</script>

<template>
    <div class="container m-0 border-b-2 border-inherit px-0 py-8">
        <div :class="`text-[${SIDEBAR_TEXT_COLOR}] pb-4 font-serif text-[18px] font-semibold leading-4`">
            {{ t("free_shipping") }}
        </div>
        <div class="container relative m-0 flex justify-start gap-3 p-0">
            <span class="grow-[2] text-wrap">
                {{ t("display_only_items_with_free_shipping") }}
            </span>
            <label class="inline-flex grow cursor-pointer items-center" for="free-shipping">
                <span :class="`pr-2 text-sm font-medium ${freeShipping ? 'text-yellow-500' : 'text-gray-800'}`">
                    {{ freeShipping ? t("yes") : t("no") }}
                </span>
                <input type="checkbox" :checked="freeShipping" @change="handleToggle" class="peer sr-only"
                    id="free-shipping" />
                <div
                    :class="`relative h-6 w-11 rounded-full ${freeShipping ? 'bg-yellow-500' : 'bg-gray-200'} peer-checked:bg-yellow-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800`">
                    <div
                        :class="`absolute top-[2px] ${freeShipping ? 'start-[25px]' : 'start-[2px]'} size-5 rounded-full border border-gray-300 bg-white transition-all`"
                        />
                </div>
            </label>
        </div>
    </div>
</template>
