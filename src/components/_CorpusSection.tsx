import React, {useState} from 'react';
import { useCorpusType, CorpusElementType } from '../hooks/useCorpus';
import { motion, AnimatePresence } from "framer-motion"



export const CorpusSection = ({ corpus , addCorpusElement , buildModel }: CorpusSectionPropTypes) => {
    return (
        <section className="corpus-section mt-5">
            <CorpusForm addCorpusElement={addCorpusElement} buildModel={buildModel} />
            <CorpusContainer corpus={corpus} />
        </section>
    )
}

const CorpusForm = ({ addCorpusElement, buildModel }: CorpusFormPropTypes) => {
    const [corpusElement, setCorpusElement] = useState<CorpusElementType>('');
    return (
        <form className="corpus-form mt-5">
        <label htmlFor="corpus-input" className="corpus-label full-width">Add to corpus:</label>
        <input 
            id="corpus-input" 
            className='full-width'
            type="text" 
            autoComplete='off'
            onBlur={e => setCorpusElement(e.target.value)} />
        <button type='button' onClick={() => addCorpusElement(corpusElement)}>Add</button>
        <button type='button' onClick={buildModel}>Build Model</button>
    </form>
    )
}

const CorpusContainer = ({ corpus }: CorpusContainerPropTypes) => {
    return (
        <AnimatePresence>
            <motion.div
                className='corpus-container'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {corpus.map((content, idx) => (
                    <CorpusElement content={content} idx={idx} />
                ))}
            </motion.div>
        </AnimatePresence>
    )
}

const CorpusElement = ({ content, idx }: { content: string, idx: number }) => {
    return (
        <AnimatePresence>
            <motion.div
                key={`ce-${idx}`}
                className={`corpus-element full-width ce-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >{content}</motion.div>
        </AnimatePresence>
    )
}

type CorpusSectionPropTypes = {
    corpus: useCorpusType['corpus'],
    addCorpusElement: useCorpusType['addCorpusElement'],
    buildModel: useCorpusType['buildModel']
}
type CorpusFormPropTypes = {
    addCorpusElement: useCorpusType['addCorpusElement'], 
    buildModel: useCorpusType['buildModel']
}
type CorpusContainerPropTypes = { corpus: useCorpusType['corpus'] }