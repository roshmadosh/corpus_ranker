import React, { useState, useEffect } from "react";
import { CorpusSection, Predict } from "./components";
import { ToastType, Toast } from "./components/_Toast";


const ws = new WebSocket("ws://localhost:8000/rank/");


export const App = () => {
    const [corpus, setCorpus] = useState<AppState['corpus']>([]);
    const [toast, setToast] = useState<AppState['toast']>()
    
    useEffect(() => {
        const timer = setTimeout(() => { setToast(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [toast])

    ws.onmessage = event => {
        const { data } = event;
        const response_obj = JSON.parse(data);
        const { success, message, ranks } = response_obj
        
        if (success) {
            setCorpus(ranks);
        } else {
            setToast({ success, message });
        }
    }

    const addResult: StateSetter<CorpusElementType> = (corpusElement: CorpusElementType) => {
        const updatedCorpus = [...corpus, corpusElement];
        setCorpus(updatedCorpus);
    }

    const buildModel = async () => {

        // save corpus to local storage
        localStorage.setItem('corpus-ranker_corpus', JSON.stringify(corpus));

        // send corpus to model-builder API endpoint
        const request_body = {
            corpus
        }

        const response_obj = await fetch('http://localhost:8000/model', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request_body)
            })

        const response = await response_obj.json();
 
        setToast({ success: response.success, message: response.message })   
    }

    const rankCorpus = (userInput: string) => {
        const corpus = localStorage.getItem('corpus-ranker_corpus') ?? '[]'
        const corpus_obj = {
            userInput,
            corpus: JSON.parse(corpus)
        }
        ws.send(JSON.stringify(corpus_obj))
    }


    return (
        <main>
            <CorpusSection corpus={corpus} addResult={addResult} buildModel={buildModel} />
            <Predict rankCorpus={rankCorpus}/>
            {toast && <Toast success={toast.success} message={toast.message}/>}
        </main>
    )

};



export type CorpusElementType = string

export type AppChildrenPropTypes = {
    corpus: AppState['corpus'],
    addResult: StateSetter<CorpusElementType>,
    buildModel: () => void,
    rankCorpus: (userInput: string) => void,    
}

type AppState = {
    corpus: CorpusElementType[],
    toast: ToastType | undefined
}
