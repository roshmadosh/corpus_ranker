import { useState, useEffect } from "react"
import { StateSetter } from "../utils";


export const useFlag = () => {
    const [flag, setFlag] = useState<FlagType>();

    useEffect(() => {
        const timer = setTimeout(() => { setFlag(undefined)}, 3000);
        return () => { clearTimeout(timer); }    

    }, [flag])
    

    return { flag, setFlag } as useFlagType
}


type useFlagType = {
    flag: FlagType,
    setFlag: StateSetter<FlagType>
}


type FlagType = {
    success: boolean,
    message: string
} | undefined