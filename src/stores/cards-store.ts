import { defineStore } from 'pinia'
import { MAX_PRICE, MIN_PRICE } from '@/consts/price-range-const'
import type { CardProps } from '@/types/card.type'

export const useCardsStore = defineStore('cards', {
    state: () => ({
        cards: [] as CardProps[],
        filteredCards: [] as CardProps[],
        maxPrice: MAX_PRICE as number,
        minPrice: MIN_PRICE as number
    }),

    actions: {
        setCards(cards: CardProps[]) {
            this.cards = cards
        },
        setFilteredCards(filteredCards: CardProps[]) {
            this.filteredCards = filteredCards
        },
        setMaxPrice(cardBeforePriceFilter: CardProps[]) {
            if (cardBeforePriceFilter.length > 0) {
                const filteredCardsPrice = cardBeforePriceFilter.map((card) => card.price)
                this.maxPrice = Math.max(...filteredCardsPrice)
                this.minPrice = Math.min(...filteredCardsPrice)
            } else {
                this.maxPrice = MAX_PRICE
                this.minPrice = MIN_PRICE
            }
        }
    }
})
