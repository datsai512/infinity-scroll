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
    products: [ProductType],
    total: number,
    skip: number,
    limit: number,
    status: number,
}

export interface ProductCatoriesResponse {
    data: [string],
    status: number,
}