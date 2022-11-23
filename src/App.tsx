import React, { useContext } from "react";
import { CorpusSection, Predict, Toast, Header, AboutPage} from "./components";
import { useCorpus } from "./hooks/useCorpus";

import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";
import { useFlag } from "./hooks/useFlag";


const ws = new WebSocket("ws://localhost:8000/rank/");

export const App = () => {
    const { flag, setFlag } = useFlag();
    const {
        corpus, 
        addCorpusElement, 
        removeCorpusElement, 
        buildModel, 
        rankCorpus,  
        updateTfidfParams,
        updateNnParams
    } = useCorpus(ws, setFlag);


    
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

