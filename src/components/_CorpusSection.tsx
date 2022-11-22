import React, {useState} from 'react';
import { useCorpusType, CorpusElementType } from '../hooks/useCorpus';
import { motion, AnimatePresence } from "framer-motion"



export const CorpusSection = ({ corpus , addCorpusElement, updateTfidfParams, removeCorpusElement, buildModel }: CorpusSectionPropTypes) => {
    return (
        <section className="corpus-section mt-5">
            <CorpusParams updateTfidfParams={updateTfidfParams} />
            <CorpusForm 
                addCorpusElement={addCorpusElement} 
                buildModel={buildModel} 
            />
            <CorpusContainer corpus={corpus} removeCorpusElement={removeCorpusElement} />
        </section>
    )
}
const CorpusParams = ({ updateTfidfParams }: CorpusParamsType) => {
    return (
        <fieldset className="corpus-params">
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

const CorpusForm = ({ addCorpusElement, buildModel }: CorpusFormPropTypes) => {
    const [corpusElement, setCorpusElement] = useState<CorpusElementType>('');
    return (
        <form className="corpus-form mt-5" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="corpus-input" className="corpus-label full-width">Add to corpus:</label>
            <input 
                id="corpus-input" 
                className='full-width'
                type="text" 
                autoComplete='off'
                onBlur={e => setCorpusElement(e.target.value)} />
            <button type='reset' onClick={() => addCorpusElement(corpusElement)}>Add</button>
            <button type='reset' onClick={buildModel}>Build Model</button>
        </form>
    )
}

const CorpusContainer = ({ corpus, removeCorpusElement }: CorpusContainerPropTypes) => {
    return (
        <AnimatePresence>
            <motion.div
                className='corpus-container'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {corpus.map((content, idx) => (
                    <AnimatePresence>
                        <motion.div
                            key={`ce-${idx}`}
                            className={`corpus-element full-width ce-${idx}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        ><p>{content}</p><span onClick={() => removeCorpusElement(content)} >x</span></motion.div>
                    </AnimatePresence>
                ))}
            </motion.div>
        </AnimatePresence>
    )
}


type CorpusSectionPropTypes = {
    updateTfidfParams: useCorpusType['updateTfidfParams']
    corpus: useCorpusType['corpus'],
    addCorpusElement: useCorpusType['addCorpusElement'],
    removeCorpusElement: useCorpusType['removeCorpusElement'],
    buildModel: useCorpusType['buildModel']
}

type CorpusParamsType = {
    updateTfidfParams: useCorpusType['updateTfidfParams']
}

type CorpusFormPropTypes = {
    addCorpusElement: useCorpusType['addCorpusElement'],
    buildModel: useCorpusType['buildModel']
}
type CorpusContainerPropTypes = { 
    corpus: useCorpusType['corpus'],
    removeCorpusElement: useCorpusType['removeCorpusElement'],
}
