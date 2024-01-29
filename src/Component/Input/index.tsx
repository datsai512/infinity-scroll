import React, { ChangeEvent, LegacyRef, forwardRef } from "react";


type Props = {
    className?: string,
    placeholder?: string
    onChange?: (e:ChangeEvent<HTMLInputElement>) => void
    defaultValue?:string,
}

const Input = (props:Props, ref: LegacyRef<HTMLInputElement>) => {
    const { className, placeholder ='', onChange, defaultValue='' } = props;
    return  (
        <input
            ref={ref} 
            className={`w-full ${className}`}
            placeholder={placeholder}
            onChange={onChange}
            defaultValue={defaultValue}
        />
    )
}


export default forwardRef(Input);