import { log } from "console";
import React, { useEffect, useState } from "react";

type SelectProps = {
    classNameSelect?:string
    data?: [] | [string] | string[]
    valueKey?: string
    labelKey?: string
    rawString?: boolean
    onSelect?: (value: string | number | {} | []) => void,
    value?: string | number,
    classNameOption?: string, 
    defaultPlaceHolder?: string
    defaultValue?:string
}

type OptionType = {
    value: string,
    label: string,
    disabled?: boolean,
    hidden?: boolean
    selected?: boolean
}

type StateType = {
    data: OptionType[] | [],
    value?: string | number 
}


const formatDataSelect = (data: [] | any, valueKey: string, labelKey: string, rawString: boolean, defaultPlaceHolder:string='', defaultValue='') => {
    const newArr : OptionType[] = [];
    
    newArr.push({
        label: defaultPlaceHolder ? defaultPlaceHolder : "Choose here",
        value: '',
        disabled: true,
        selected: true,
        hidden: true
    });

    for (let i = 0; i < data?.length; i++) {
        const curItem = data[i];

        newArr.push({
            value: (valueKey && !rawString) ? curItem[valueKey] : curItem,
            label: (labelKey && !rawString) ? curItem[labelKey] : curItem
        });
    }
    return newArr;
}

const Select = (props:SelectProps) => {
    const { classNameSelect, data=[], valueKey='', labelKey = '', rawString = false, value, onSelect, classNameOption='', defaultPlaceHolder = ''} = props;
    const [ state, setState ] = useState<StateType>({
        data: [],
        value: ''
    });

    useEffect(() => {
        const handleInit = () => {
            const formatedData = formatDataSelect(data, valueKey, labelKey, rawString, defaultPlaceHolder);
            state.data = formatedData || [];
            if(value) {
                state.value = value;
            }
            setState({...state});
        }
        handleInit();

    }, [JSON.stringify(data)]);

    const onChangeSelect = (event : any) => {
        const data = event.target.value;
        state.value = data;
        setState({...state});

        if(typeof onSelect === 'function') {
            onSelect(data);
        }
    }

    return (
        <select
            className={`${classNameSelect}`} 
            onChange={onChangeSelect} 
            value={state.value}
        >
            {state.data?.map((item: OptionType, index: number) => {
                return (
                    <option 
                        key={index + item.value + item.label} 
                        className={`${classNameOption}`} 
                        value={item.value}
                        disabled={item?.disabled}
                        selected={item?.selected}
                        hidden={item?.hidden}
                    >
                        {item.label}
                    </option>
                )
            })}
        </select>
    )
}

export default Select;