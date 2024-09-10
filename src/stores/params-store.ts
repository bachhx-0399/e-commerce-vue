import { defineStore } from 'pinia';
import { MIN_PRICE, MAX_PRICE } from '@/consts/price-range-const';
import { DEFAULT_SORT_BY, DEFAULT_HITS_PER_PAGE } from '@/consts/default-params.const';

export const useParamsStore = defineStore('params', {
  state: () => ({
    searchQuery: '',
    categories: [] as string[],
    brands: [] as string[],
    priceRangeValue: [MIN_PRICE, MAX_PRICE],
    rating: undefined as number | undefined,
    freeShipping: false,
    sortBy: DEFAULT_SORT_BY,
    hitsPerPage: DEFAULT_HITS_PER_PAGE,
    colorSearch: '',
    colorsList: [] as string[],
    currentPage: 1
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
    setSortBy(sortBy: string) {
      this.sortBy = sortBy;
    },
    setHitsPerPage(hitsPerPage: number) {
      this.hitsPerPage = hitsPerPage;
    },
    setColorSearch(colorSearch: string) {
      this.colorSearch = colorSearch;
    },
    setColorsList(colorsList: string[]) {
      this.colorsList = colorsList;
    },
    resetParams() {
      this.searchQuery = '';
      this.categories = [];
      this.brands = [];
      this.priceRangeValue = [MIN_PRICE, MAX_PRICE];
      this.rating = undefined;
      this.freeShipping = false;
      this.sortBy = DEFAULT_SORT_BY;
      this.colorSearch = '';
      this.colorsList = [];
      this.hitsPerPage = DEFAULT_HITS_PER_PAGE;
    },
  },
});
