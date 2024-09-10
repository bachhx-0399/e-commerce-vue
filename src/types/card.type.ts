interface CardProps {
    name: string
    description: string
    categories: string[]
    image: string
    price: number
    rating: number
    free_shipping: boolean
    brand?: string
    corlor?: string
}

const createCardFromServerData = (props: CardProps): CardProps => {
    const [color, name] = props.name
        .split('-')
        .map((item) => item.trim())
        .reverse()

    return {
        name: props.name,
        description: props.description,
        categories: props.categories,
        image: props.image,
        price: props.price,
        rating: props.rating,
        free_shipping: props.free_shipping,
        brand: props.brand,
        corlor: color ?? 'Black'
    }
}

const processServerCardsArray = (props: CardProps[]): CardProps[] => {
    return props.map(createCardFromServerData)
}

export type { CardProps }
export { processServerCardsArray }
