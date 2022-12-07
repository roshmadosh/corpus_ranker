import React, {useState} from 'react';
import { useCorpusType, CorpusElementType } from '../hooks/useCorpus';
import { motion, AnimatePresence } from "framer-motion"



export const CorpusSection = ({ corpus , addCorpusElement, updateTfidfParams, updateNnParams, removeCorpusElement, buildModel }: CorpusSectionPropTypes) => {
    return (
        <form className="corpus-form mt-5" onSubmit={(e) => e.preventDefault()}>
            <CorpusForm 
                addCorpusElement={addCorpusElement} 
                buildModel={buildModel} 
            />
            <CorpusContainer corpus={corpus} removeCorpusElement={removeCorpusElement} />
        </form>
    )
}


const CorpusForm = ({ addCorpusElement, buildModel }: CorpusFormPropTypes) => {
    const [corpusElement, setCorpusElement] = useState<CorpusElementType>('');
    return (
        <div className="mt-5">
            <label htmlFor="corpus-input" className="corpus-label">Add to corpus:</label>
            <div className='add-corpus-container '>
                <input 
                    id="corpus-input" 
                    type="text" 
                    autoComplete='off'
                    onBlur={e => setCorpusElement(e.target.value)} />
                <button type='reset' onClick={() => addCorpusElement(corpusElement)}>Add</button>
                <button type='submit' onClick={buildModel}>Build Model</button>
            </div>
        </div> 
    )
}

const CorpusContainer = ({ corpus, removeCorpusElement }: CorpusContainerPropTypes) => {
    return (

        <motion.div
            // @ts-ignore
            key={corpus}
            className='corpus-container'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {corpus.map((content, idx) => (
                    <motion.div
                        className={`corpus-element full-width ce-${idx}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * .1 }}
                    ><p>{content}</p><span onClick={() => removeCorpusElement(content)} >x</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>

    )
}


type CorpusSectionPropTypes = {
    updateTfidfParams: useCorpusType['updateTfidfParams']
    updateNnParams: useCorpusType['updateNnParams']
    corpus: useCorpusType['corpus'],
    addCorpusElement: useCorpusType['addCorpusElement'],
    removeCorpusElement: useCorpusType['removeCorpusElement'],
    buildModel: useCorpusType['buildModel']
}



type CorpusFormPropTypes = {
    addCorpusElement: useCorpusType['addCorpusElement'],
    buildModel: useCorpusType['buildModel']
}
type CorpusContainerPropTypes = { 
    corpus: useCorpusType['corpus'],
    removeCorpusElement: useCorpusType['removeCorpusElement'],
}
