<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'CustomButton',
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset' | undefined>,
      default: 'button',
    },
  },
})
</script>


<template>
  <button class="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-500 transition-colors" :type="type">
    {{ text }}
  </button>
</template>
