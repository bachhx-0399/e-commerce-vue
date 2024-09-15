import { type CardProps } from '@/types/card.type';

interface CartItemInterface {
    product: CardProps;
    amount: number;
    isChecked: boolean;
}

export type { CartItemInterface };
