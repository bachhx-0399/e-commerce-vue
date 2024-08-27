import { defineStore } from 'pinia';

export const useParamsStore = defineStore('params', {
  state: () => ({
    searchQuery: '',
  }),

  actions: {
    setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery;
    },
    clearParams() {
      this.searchQuery = '';
    }
  },
});
