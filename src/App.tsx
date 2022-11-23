import React, { useState, useEffect } from "react";
import { CorpusSection, Predict, Toast, Header, AboutPage} from "./components";
import { FlagType } from "./utils";
import { useCorpus } from "./hooks/useCorpus";
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";


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
        const fetchCookie = async () => await fetch('http://localhost:8000/cookie',  {
            method: 'POST',
            mode: "cors",
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());

        const cookie = fetchCookie()
        console.log(cookie)
    }, [])
    
    useEffect(() => {
        setFlag(corpusFlag)
        const timer = setTimeout(() => { setFlag(undefined)}, 3000);
        return () => { clearTimeout(timer); }
    }, [corpusFlag])


    return (

        <Router>
            <Header />
            <Switch>
                <Route path="/about">
                    <AboutPage />
                </Route>
                <Route path="/">
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
                </Route>
            </Switch>
        </Router>
        

    )

};

