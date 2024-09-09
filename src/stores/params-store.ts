import { defineStore } from 'pinia';
import { MIN_PRICE, MAX_PRICE } from '@/consts/price-range-const';

export const useParamsStore = defineStore('params', {
  state: () => ({
    searchQuery: '',
    categories: [] as string[],
    brands: [] as string[],
    priceRangeValue: [MIN_PRICE, MAX_PRICE],
    rating: undefined as number | undefined,
    freeShipping: false,
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
    setPriceRangeValue(priceRangeValue: number[]) {
      this.priceRangeValue = priceRangeValue;
    },
    setRating(rating: number | undefined) {
      this.rating = rating;
    },
    setFreeShipping(freeShipping: boolean) {
      this.freeShipping = freeShipping;
    },
    resetParams() {
      this.searchQuery = '';
      this.categories = [];
      this.brands = [];
      this.priceRangeValue = [MIN_PRICE, MAX_PRICE];
      this.rating = undefined;
      this.freeShipping = false;
    },
  },
});
