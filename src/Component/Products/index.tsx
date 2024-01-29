import React, { useState, useEffect, ChangeEvent, useRef, LegacyRef, MutableRefObject } from "react";
import { getListProduct, getListCategoriy, handleSearchProduct, getListProductByCategory } from '../../Request/product';
import { ProductType, ProductResponse } from '../../Types/product';
import { concatQuerySearch } from '../../Utils';
import ScrollMoreLayout from '../../Layout/ScrollMoreLayout'

import Product from '../Product';
import Input from "../Input";
import Spinner from '../Spinner';
import Select from '../../Component/Select';


let timerDebounce: null | ReturnType<typeof setTimeout> = null;
let runOnlyOne = false;
let hasSearching = false;
let hasFilterByCategory = false;
let prevListProduct :  ProductType[] | [] = [];
let prevListFilter :   ProductType[] | [] = [];

type ProductsComponentState = {
    listProduct:  ProductType[]  | [],
    listCategory: [string] | [],
    pageSetting : {
        limit: number,
        skip:  number,
        total: number
    }
    status: 'Loading' | 'Nodata' | 'Done';
}

const useQuery = () => {
    return new URLSearchParams(window.location.search);
};


const Products = () => {
    const searchQuery = useQuery().get('search') || '';
    const categoryQuery = useQuery().get('category') || '';
    const overListStringRef = useRef({} as HTMLElement);
    const inputRef = useRef() as any;

    const [state, setState] = useState<ProductsComponentState>({
        listProduct: [],
        listCategory: [],
        pageSetting : {
            limit: 20 as number,
            skip: 0 as number,
            total: 0 as number
        },
        status: 'Loading',
    });

    useEffect(() => {
        const handleInit = async () => {
            runOnlyOne = true;
            document.title = 'Products';
            await handleGetCategories();
            await handleGetProducts(20, 0, !!!((searchQuery || (categoryQuery && categoryQuery.toLowerCase() != 'all'))));
            if(categoryQuery) {
                if(categoryQuery.toLowerCase() === 'all') {
                    window.history.pushState(state, categoryQuery, '/');
                } else {
                    await onSelectCategory(categoryQuery);
                }
            } 
            if(searchQuery) {
                inputRef.current.focus();
                inputRef.current.value = searchQuery;
                await handleSearch(searchQuery);
            }
        }

        if(runOnlyOne) return;
        handleInit();
        return () => {
            if(timerDebounce) clearTimeout(timerDebounce);
        }
    }, [])

    const handleGetProducts = async (limit?:number | 20, skip?:number | 0, updateUI?: boolean | true) => {
        const config = {
            limit : limit || 20,
            skip:  skip || 0,
            keys:  ['name', 'title', 'price', "thumbnail", "discountPercentage", "rating", "category"],
        };

        const response : ProductResponse = await getListProduct(config, false);
        if(response.status === 200) {
            if(state.listProduct.length == 0) {
                state.listProduct = response.products;
            } else {
                for (let i = 0; i < response.products.length; i++) {
                    const product = response.products[i];
                    const listProduct : ProductType[]= state.listProduct; /// redefine type
                    listProduct.push(product);
                }
            }

            prevListProduct = state.listProduct;
            state.pageSetting.limit = response.limit;
            state.pageSetting.skip = response.skip;
            state.pageSetting.total = response.total;
            state.status = 'Done';
            if(updateUI) setState({...state});

            return response.products as [ProductType];
            
        } else if(response.status === 400) {
            alert('Not found');
        }else {
            alert('Internal Server!');
        }
    }

    const handleGetCategories = async () => {
        const response = await getListCategoriy();
        if(response.status === 200) {
            state.listCategory = response.data;
            state.listCategory.unshift('All')
            setState(prev => ({...prev}));
        } else if(response.status === 400) {
            alert('Not found');
        }else {
            alert('Internal Server!');
        }
    }

    const handleSearch = async (search:string) => {
        search = search.trim() || '';
        if(!search) {
            state.listProduct = hasFilterByCategory ? prevListFilter : prevListProduct;
            setState({...state});
            const querry =  hasFilterByCategory ? `/?category=${categoryQuery}` : '/'
            window.history.pushState(state, search, querry);
            
            hasSearching = false;
            return;
        }

        if(hasFilterByCategory) {
            var regexSearch = new RegExp(search, 'gmi');
            const newArrayFilter = prevListFilter.filter(item => item.title?.match(regexSearch)) || [];

            if(newArrayFilter.length === 0) state.status = 'Nodata';
            state.listProduct = newArrayFilter;

            const querry = concatQuerySearch({search: search ? search : searchQuery});
            window.history.pushState(state, search, `/${querry}`);

            setState({...state});

        } else {

            const response :ProductResponse = await handleSearchProduct({search});
            
            if(response.status === 200) {
                state.listProduct = response.products;
                if(response.products.length <= 0) {
                    state.status = 'Nodata';
                } else {
                    state.status = 'Done';
                }
    
                setState({...state});
                const str = search ? `/?search=${search}` : '/';
                window.history.pushState(state, search, str);
    
            } else if(response.status === 400) {
                alert('Not found');
            } else {
                alert('Internal Server!');
            }
        }

    }

    const onSearch = (e:ChangeEvent<HTMLInputElement>) => {
        hasSearching = true;
        const value = e.target.value;
        const timerDebounceSearch = 250;
        if(timerDebounce) clearTimeout(timerDebounce);
        timerDebounce = setTimeout(async() => {
            await handleSearch(value);
        }, timerDebounceSearch);

    }

    const onLoadMore = async () => {
        if(hasSearching && hasFilterByCategory) return;
        if(state.pageSetting.total <= state.listProduct.length) {
            overListStringRef.current.innerHTML = 'Not available new products';
            setTimeout(() => {
                overListStringRef.current.innerHTML = '';
            }, 3500)
            return;
        }
        state.status = 'Loading';
        setState({...state});
        await handleGetProducts(20, state.pageSetting.skip + 20, true);
    }

    const onRenderNoData = () => {
        if(state.status === 'Nodata') return 'Empty Products';
        if(state.status === 'Loading') return <Spinner className="z-50 scale-110" color="blue-300"/>;
        return ''
    }

    const onSelectCategory = async (value: string | number | {}) => {
        inputRef.current.value = '';
        window.history.pushState(state, value as string, `?category=${value}`);

        if(value === 'All') {
            hasFilterByCategory = false;
            state.listProduct = prevListProduct;
            setState({...state});
            window.history.pushState(state, value as string, '/');
            return;
        }

        state.status = 'Loading'
        state.listProduct = [];
        setState({...state});

        hasFilterByCategory = true;
        const response:ProductResponse = await getListProductByCategory(value as string);
        if(response.status === 200) {
            state.listProduct = response.products;
            prevListFilter = state.listProduct;
            state.status = 'Done';
            if(state.listProduct.length === 0) {
                state.status = 'Nodata';
            }
            setState({...state});
        }

    }

    return (
        <div className="h-[100vh] bg-slate-100  w-full flex flex-col relative gap-4 pb-6">
            <div className="flex gap-2 self-center flex-wrap">
                <Input
                    ref={inputRef}
                    className="lg:!w-[500px] !w-full !h-14 rounded-lg  p-3 mt-3 font-[300] sm:!min-w-[280px] sm:h-12" 
                    placeholder='Search Product' 
                    onChange={onSearch} 
                    defaultValue={searchQuery}
                />
                <Select
                    defaultPlaceHolder='Categories' 
                    classNameSelect='lg:!w-[180px] !w-full !h-14 rounded-lg p-3 mt-3 pr-5 font-[300] sm:!min-w-[280px] sm:h-12' 
                    data={state.listCategory}
                    value={categoryQuery} 
                    rawString={true}
                    onSelect={onSelectCategory}
                    classNameOption="!bg-red-600 text-red-600"
                />
            </div>

            <ScrollMoreLayout onScrollMore={onLoadMore} className="" hasDebounce={true}>
                <div className="flex flex-wrap  gap-5 justify-center self-start p-10 z-10 w-full h-full">
                    {state.listProduct?.length > 0 ? state.listProduct.map((item:ProductType) => {
                        return (
                            <div key={item.id}>
                                <Product data={item}/>
                            </div>
                        )
                    }) : (
                        <div className='text-[32px] font-semibold text-black'>
                            {onRenderNoData()}
                        </div>
                    )}
                    <span ref={overListStringRef} className="absolute left-1/2 translate-x-[-50%] text-red-500 z-10 bottom-0 "></span>
                </div>
            </ScrollMoreLayout>

            {(state.status === 'Loading' && state.listProduct.length > 0) ? (
                <Spinner className="absolute left-1/2 bottom-[30px] z-50 scale-110" color="blue-300"/>
            ) : (<></>)}

        </div>
    )
}

export default Products;