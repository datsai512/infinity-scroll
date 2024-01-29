export interface ProductType {
    id: string ,
    title?: string,
    description?: string,
    price: number,
    discountPercentage?: number,
    rating?: number,
    stock?: number,
    brand?: string,
    category?: string,
    thumbnail?: string,
    images?: [string]
}



export interface ProductResponse {
    products: ProductType[] | [] | undefined,
    total: number | 0,
    skip: number | 0,
    limit: number | 0,
    status: number | 0,
}

export interface ProductCatoriesResponse {
    data: [string],
    status: number,
}