import request from "./instance";
import axios, { AxiosError } from "axios";
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
    try {
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
    } catch(e) {
        console.log('getListProduct get error', e);
        return e;
    }
};


export const handleSearchProduct = async (data: {search: string | ""}) => {
    const  { search } = data;
    try {
        const response = await request.get(`/products/search?q=${search}&limit=20&skip=1`);
        const result : ProductResponse = {
            status: response.status,
            ...response.data, 
        };
        return result;
    } catch(e) {
        console.log('handleSearchProduct get error', e);
        return e as AxiosError
    }
}

export const getListCategoriy = async () => {
    try {
        const response = await request.get('/products/categories');
        const result: ProductCatoriesResponse = {
            status: response.status,
            data: response.data
        }
        return result;
    } catch (e) {
        console.log('getListCategoriy get error', e);
        return e as AxiosError
    }
};

export const getListProductByCategory = async (type:string) => {
    try {
        const response = await request.get(`/products/category/${type}?limit=999`);
        const result: ProductResponse  = {
            status: response.status,
            ...response.data,
        }
        return result;
    } catch (e) {
        console.log('getListProductByCategory get error', e)
        return e as AxiosError
    }
}