import React, { useState, useEffect, createContext, useContext, ReactNode } from "react"


const FlagContext = createContext<{ flag: FlagType, updateFlag: (flag: FlagType) => void} | undefined>(undefined)


const FlagProvider = ({ children }: { children: ReactNode }) => {
    const [flag, setFlag] = useState<FlagType>();
    const updateFlag = (flag: FlagType) => {
        setFlag(flag)
    }

    useEffect(() => {
        const timer = setTimeout(() => { setFlag(undefined)}, 3000);
        return () => { clearTimeout(timer); }    

    }, [flag])

    return (
        <FlagContext.Provider value={{ flag, updateFlag }}>
            {children}
        </FlagContext.Provider>
    )
}

const useFlag = () => {
    const context = useContext(FlagContext);
    if (context === undefined) {
        throw new Error('useFlag must be used within a FlagProvider')
    }
    return context
}
    

export { FlagProvider, useFlag }

type FlagType = {
    success: boolean,
    message: string
} | undefined