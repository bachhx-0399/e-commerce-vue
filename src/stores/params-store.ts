import { defineStore } from 'pinia';

export const useParamsStore = defineStore('params', {
  state: () => ({
    searchQuery: '',
    categories: [] as string[],
  }),

  actions: {
    setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery;
    },
    setCategories(categories: string[]) {
      this.categories = categories;
    },
    resetParams() {
      this.searchQuery = '';
      this.categories = [];
    },
  },
});
