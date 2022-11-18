import React, { useState, useEffect } from "react";
import { CorpusForm, Predict } from "./components";
import { ToastType, Toast } from "./components/_Toast";
import { StateSetter } from "./utils"


export type AppChildrenPropTypes = {
    corpusForm: {
        corpus: AppState['corpus'],
        setCorpus: StateSetter<AppState['corpus']>,
        setToast: StateSetter<AppState['toast']>
    },
    predict: {
        corpus: AppState['corpus'],
        setCorpus: StateSetter<AppState['corpus']>,
        setToast: StateSetter<AppState['toast']>,
        websocket: WebSocket
    }
}

type AppState = {
    corpus: string[],
    toast: ToastType | undefined
}

const ws = new WebSocket("ws://localhost:8000/rank/");

export const App = () => {
    const [corpus, setCorpus] = useState<AppState['corpus']>([]);
    const [toast, setToast] = useState<AppState['toast']>()
    
    useEffect(() => {
        const timer = setTimeout(() => { setToast(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [toast])

    return (
        <main>
            <CorpusForm corpus={corpus} setCorpus={setCorpus} setToast={setToast}/>
            <Predict corpus={corpus} websocket={ws} setToast={setToast} setCorpus={setCorpus}/>
            {toast && <Toast success={toast.success} message={toast.message}/>}
        </main>
    )

};
