import React from 'react';
import { useCorpusType } from '../hooks/useCorpus';



export const Predict = ({ rankCorpus }: PredictPropTypes) => {
    return (
        <div className="search-container mt-5">
            <label htmlFor="search-input">Search:</label>
            <input 
                type="text" 
                id="search-input"
                autoComplete="off"
                onChange={e => rankCorpus(e.target.value)}
            />
        </div>
    )
}

type PredictPropTypes = {
    rankCorpus: useCorpusType['rankCorpus']
}