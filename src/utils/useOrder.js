import {useCallback, useEffect, useState} from "react";
import newArr from "./newArr.js";

export default function useOrder(len) {
    const [order, setOrder] = useState(newArr(len, i => i));
    useEffect(() => {
        setOrder(newArr(len, i => i));
    }, [len]);
    const active = useCallback(ids => {
        if (typeof ids === 'number')
            setOrder(oriOrder => {
                const newOrder = oriOrder.filter(i => ids !== i);
                newOrder.push(ids);
                return newOrder;
            })
        else
            setOrder(oriOrder => {
                const newOrder = oriOrder.filter(i => !ids.includes(i));
                newOrder.push(...ids);
                return newOrder;
            })
    }, [])
    return [order, active];
}