import React, { useState, useEffect } from "react";
import { CorpusSection, Predict, Toast } from "./components";
import { FlagType } from "./utils";
import { useCorpus } from "./hooks/useCorpus";


const ws = new WebSocket("ws://localhost:8000/rank/");

export const App = () => {
    const {
        corpus, 
        addCorpusElement, 
        removeCorpusElement, 
        buildModel, 
        rankCorpus, 
        corpusFlag, 
        updateTfidfParams,
        updateNnParams
    } = useCorpus(ws);

    const [flag, setFlag] = useState<FlagType>()
    
    useEffect(() => {
        setFlag(corpusFlag)
        const timer = setTimeout(() => { setFlag(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [corpusFlag])


    return (
        <main>
            <CorpusSection 
                updateTfidfParams={updateTfidfParams}
                updateNnParams={updateNnParams}
                corpus={corpus} 
                addCorpusElement={addCorpusElement} 
                removeCorpusElement={removeCorpusElement}
                buildModel={buildModel} 
            />
            <Predict rankCorpus={rankCorpus}/>
            {flag && <Toast success={flag.success} message={flag.message}/>}
        </main>
    )

};

