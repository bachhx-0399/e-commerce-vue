import { RATING_OPTIONS } from "../consts/rating-option.const";

type RatingOption = (typeof RATING_OPTIONS)[number];

interface RatingStartProps {
    rating: RatingOption;
    count: number;
}

export type { RatingStartProps, RatingOption };
