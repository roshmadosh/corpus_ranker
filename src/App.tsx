import React from "react";
import { CorpusParams, CorpusSection, Predict, Toast, Header, AboutPage} from "./components";
import { useCorpus } from "./hooks/useCorpus";
import { useFlag } from "./hooks/useFlag";
import {
    BrowserRouter as Router,
    Route,
    Switch
  } from "react-router-dom";


export const App = () => {
    const { flag } = useFlag()
 
    const {
        corpus, 
        addCorpusElement, 
        removeCorpusElement, 
        buildModel, 
        rankCorpus,  
        updateTfidfParams,
        updateNnParams
    } = useCorpus();

    
    return (

        <Router>
            <Header />
            <Switch>
                <Route path="/about">
                    <AboutPage />
                </Route>
                <Route path="/">
                    <CorpusParams updateTfidfParams={updateTfidfParams} updateNnParams={updateNnParams} />
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

