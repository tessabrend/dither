export interface RatingProps {
    rating?: number, 
    setRating(rating: number): any
}

export interface GroupMembers {
    id: string;
    name: string;
}

export interface SliderProps {
    value?: number,
    caption?: string,
    unit?: string,
}

export interface DropdownProps {
    selection: string[],
    updateSelection(value: string): any
}

export interface RestaurantQueryParams {
    cuisineType?: string[],
    diningType?: string[],
    priceBucket?: string[],
    coords?: string,
    rating?: number,
    maxDistance?: number
}
