import React, { ReactElement } from "react";

type ScrollMoreLayoutProps = {
    children: ReactElement,
    className?: string,
    onScrollMore?: () => void,
    hasDebounce?: boolean,
    debounceTimer?: number,
};

let timerDebounce: null | ReturnType<typeof setTimeout> = null;

const ScrollMoreLayout = (props:ScrollMoreLayoutProps, ) => {
    const { onScrollMore, hasDebounce = false, debounceTimer = 300, className='', children } = props;

    const onLoadMore = async (e:React.UIEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const contextNode : HTMLElement | any = e.target;
        const scrollTop = contextNode.scrollTop;
        const scrollHeight = contextNode.scrollHeight;
        const clientHeight = contextNode.clientHeight;

        if (scrollHeight - scrollTop === clientHeight) {
            if(!hasDebounce) {
                if(typeof onScrollMore == 'function') {
                    onScrollMore()
                }
                return;
            }

            if(timerDebounce) clearTimeout(timerDebounce);
            timerDebounce = setTimeout(async() => {
                if(typeof onScrollMore == 'function') {
                    onScrollMore()
                }
            }, debounceTimer);
        }
    }


    return (
        <div className={`w-full h-full overflow-auto ${className}`} onScroll={onLoadMore}>
            {children}
        </div>
    )
}


export default ScrollMoreLayout;