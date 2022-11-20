import React from 'react';
import { AppChildrenPropTypes } from '../App';



export const Predict = ({ rankCorpus }: PredictPropTypes) => {
    return (
        <div className="search-container container">
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
    rankCorpus: AppChildrenPropTypes['rankCorpus']
}