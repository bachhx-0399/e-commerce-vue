// src/composables/useDebounce.ts
import { ref, watch, Ref } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay: number) {
  const debouncedValue = ref(value.value) as Ref<T>;

  let timeout: ReturnType<typeof setTimeout>;

  watch(value, (newValue) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  return debouncedValue;
}
