import React from 'react';
import { useCorpusType } from '../hooks/useCorpus'

export const CorpusParams = ({ updateTfidfParams, updateNnParams }: CorpusParamsType) => {
    return (
        <fieldset className="corpus-params mt-5">
            <div className="corpus-param">
                <label htmlFor="Metric-param param" className='param-label'>Metric</label>
                <select name="metric" id="metric-param param" onChange={e => updateNnParams({ metric: e.target.value })}>
                    <option value="cosine">Cosine</option>
                    <option value="euclidean">Euclidean</option>
                    <option value="haversine">Haversine</option>
                    <option value="l1">L1</option>
                    <option value="l2">L2</option>
                    <option value="manhattan">Manhattan</option>
                    <option value="nan_euclidean">NaN Euclidean</option>
                </select>
            </div>
            <legend>Corpus Parameters</legend>
            <div className="corpus-param">
                <label htmlFor="ngram-param" className='param-label'>N-gram Range</label>
                <input 
                    type="number" 
                    name="ngram" 
                    id="ngram-param" 
                    min={1} 
                    max={5} 
                    defaultValue={1} 
                    onChange={e => updateTfidfParams({ ngramRange: [1, +e.target.value] })}
                />
            </div>
            <div className="corpus-param">
                <label htmlFor="analyzer-param param" className='param-label'>Analyzer</label>
                <select name="Analyzer" id="analyzer-param param" onChange={e => updateTfidfParams({ analyzer: e.target.value })}>
                    <option value="word">Word</option>
                    <option value="char">Char</option>
                    <option value="char_wb">Char (Word Boundaries)</option>
                </select>
            </div>
            <div className="corpus-param">
                <input type="checkbox" name="stopwords" id="stopwords-param" onChange={e => updateTfidfParams({ stopWords: e.target.checked})} />
                <label htmlFor="stopwords-param" className='param-label'>Include Stopwords</label>
            </div>
        </fieldset>
    )
}

type CorpusParamsType = {
    updateTfidfParams: useCorpusType['updateTfidfParams'],
    updateNnParams: useCorpusType['updateNnParams']
}