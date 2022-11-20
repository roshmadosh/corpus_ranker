import React, { useState, useEffect } from "react";
import { CorpusSection, Predict, Toast } from "./components";
import { FlagType } from "./utils";
import { useCorpus } from "./hooks/useCorpus";


const ws = new WebSocket("ws://localhost:8000/rank/");

export const App = () => {
    const {corpus, addCorpusElement, buildModel, rankCorpus, corpusFlag} = useCorpus(ws);
    const [flag, setFlag] = useState<FlagType>()
    
    useEffect(() => {
        setFlag(corpusFlag)
        const timer = setTimeout(() => { setFlag(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [corpusFlag])


    return (
        <main>
            <CorpusSection corpus={corpus} addCorpusElement={addCorpusElement} buildModel={buildModel} />
            <Predict rankCorpus={rankCorpus}/>
            {flag && <Toast success={flag.success} message={flag.message}/>}
        </main>
    )

};

