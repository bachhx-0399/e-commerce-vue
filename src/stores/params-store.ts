import { defineStore } from 'pinia';

export const useParamsStore = defineStore('params', {
  state: () => ({
    searchQuery: '',
    categories: [] as string[],
    brands: [] as string[],
  }),

  actions: {
    setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery;
    },
    setCategories(categories: string[]) {
      this.categories = categories;
    },
    setBrands(brands: string[]) {
      this.brands = brands;
    },
    resetParams() {
      this.searchQuery = '';
      this.categories = [];
      this.brands = [];
    },
  },
});
