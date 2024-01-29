import React from 'react';
import { ProductType } from '../../Types/product';
import './style.css';
import Rating from '../Rating';
import AddToCart from './AddToCart';

type Props = {
    data: ProductType
}

const Product = (props: Props) => {
    const { data } = props;
    const priceDiscount = (discountPercent:number, price: number) => {
        return (price - (discountPercent / 100) * price).toFixed(2);
    }
    return (
        <div 
            className='product w-[300px] h-[340px] sm:[200px] border-black/20 border-solid border-[1px] flex flex-col items-center cursor-pointer relative'
        >
            <img src={data?.thumbnail} width={200} height={200} className='w-full h-[200px] object-fill thumbails'/>
            <span className='text-[20px] self-start ml-3 font-[200] truncate w-full pr-3'>
                {data?.title}
            </span>
            <span className={`text-[20px] self-start ml-3 ${data.discountPercentage ? 'line-through text-gray-400 font-[300] text-[14px]' : ''}`}>
                ${data?.price}
            </span>

            {data.discountPercentage && (
                <span className='text-[24px] self-start ml-3 font-bold text-red-500'>
                    ${priceDiscount(data?.discountPercentage, data?.price)}
                </span>
            )}

           <div className='self-start'>
                <span className='text-[13px] font-thin ml-3 hover:underline'>
                    #{data?.category}
                </span>
           </div>

           <div className='absolute top-[70%] right-[12px] scale-95'>
                <AddToCart/>
           </div>

            {data.rating && (
                <div className='w-14 self-end mr-2 p-[2px]'>
                    <Rating number={data.rating.toFixed(1)} classNameNumber='!text-gray-500'/>
                </div>
            )}

            {data.discountPercentage && (
                <div className='absolute tag-discount'>
                    {data?.discountPercentage}%
                </div>
            )}

           
            
        </div>
    )
}

export default Product;