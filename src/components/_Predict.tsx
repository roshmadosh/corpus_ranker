import React, { useRef } from 'react';
import { useCorpusType } from '../hooks/useCorpus';



export const Predict = ({ rankCorpus }: PredictPropTypes) => {
    let timer = useRef<any>();
    function onInputChange(e: any) {
        clearTimeout(timer.current);
        timer.current = setTimeout(()=> {
            rankCorpus(e.target.value)
        }, 500)
    }
    return (
        <div className="search-container mt-5">
            <label htmlFor="search-input">Search:</label>
            <input 
                type="text" 
                id="search-input"
                autoComplete="off"
                onChange={e => onInputChange(e)}
            />
        </div>
    )
}

type PredictPropTypes = {
    rankCorpus: useCorpusType['rankCorpus']
}