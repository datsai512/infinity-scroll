import request from "./instance";
import { ProductResponse, ProductCatoriesResponse }  from '../Types/product';

let throttle = {
    data : {} as ProductResponse,
    hasThrottle : false
};

export const getListProduct = async (data: {
    limit : number | 20,
    skip: number | 20,
    keys: string[]
}, hasThrottle: boolean | false) => {
    if(hasThrottle && throttle.hasThrottle) {
        return throttle.data;
    }

    const { limit, skip, keys } = data;
    const selectedKeyParams:string = keys.length > 0 ? `&select=${keys.join(',')}`: ''; 
    const response = await request.get(`/products?limit=${limit}&skip=${skip}${selectedKeyParams}`);
    const result : ProductResponse = {
        status: response.status,
        ...response.data, 
    };

    if(hasThrottle) {
        throttle.hasThrottle = true;
        throttle.data = result;
        setTimeout(() => {
            throttle.hasThrottle = false;
        }, 800);    
    }
    return result;
};


export const handleSearchProduct = async (data: {search: string | ""}) => {
    const  { search } = data;
    const response = await request.get(`/products/search?q=${search}&limit=20&skip=1`);
    const result : ProductResponse = {
        status: response.status,
        ...response.data, 
    };
    return result;
}

export const getListCategoriy = async () => {
    const response = await request.get('/products/categories');
    const result: ProductCatoriesResponse = {
        status: response.status,
        data: response.data
    }
    return result;
};

export const getListProductByCategory = async (type:string) => {
    const response = await request.get(`/products/category/${type}?limit=9999`);
    const result: ProductResponse = {
        status: response.status,
        ...response.data, 
    }
    return result;
}