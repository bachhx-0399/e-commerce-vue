// Round up to the hundreds digit
export const priceRoundUp = (price: number) => Math.ceil(price / 100) * 100
// Round down to the tens digit
export const priceRoundDown = (price: number) => Math.floor(price / 10) * 10
