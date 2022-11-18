import React, { useState, useEffect } from "react";
import { ResultsForm, Predict } from "./components";
import { ToastType, Toast } from "./components/_Toast";
import { StateSetter } from "./utils"



export type AppChildrenPropTypes = {
    resultsForm: {
        results: AppState['results'],
        setResults: StateSetter<AppState['results']>,
        setToast: StateSetter<AppState['toast']>
    },
    predict: {
        results: AppState['results'],
        setToast: StateSetter<AppState['toast']>,
        websocket: WebSocket
    }
}

type AppState = {
    results: string[],
    toast: ToastType | undefined
}

const ws = new WebSocket("ws://localhost:8000/rank/");

export const App = () => {
    const [results, setResults] = useState<AppState['results']>([]);
    const [toast, setToast] = useState<AppState['toast']>()
    
    useEffect(() => {
        const timer = setTimeout(() => { setToast(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [toast])

    return (
        <>
            <ResultsForm results={results} setResults={setResults} setToast={setToast}/>
            <Predict results={results} websocket={ws} setToast={setToast}/>
            {toast && <Toast success={toast.success} message={toast.message}/>}
        </>
    )

};
