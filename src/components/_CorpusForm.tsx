import React, {useState} from 'react';
import { AppChildrenPropTypes } from '../App';
import { motion, AnimatePresence } from "framer-motion"


export const CorpusForm = ({ corpus , setCorpus, setToast }: AppChildrenPropTypes['corpusForm']) => {

    const [corpusElement, setCorpusElement] = useState<string>('');

    const addResult = () => {
        const updatedCorpus = [...corpus, corpusElement];
        setCorpus(updatedCorpus);
    }

    const buildModel = async () => {

        // save corpus to local storage
        localStorage.setItem('corpus-ranker_corpus', JSON.stringify(corpus));

        const request_body = {
            corpus
        }

        const response_obj = await fetch('http://localhost:8000/model', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request_body)
            })

        const response = await response_obj.json();
 
        setToast({ success: response.success, message: response.message })
        
    }

    return (
        <section className="corpus-section mt-5">
            <form className="corpus-form">
                <label htmlFor="corpus-input" className="corpus-label full-width">Add to corpus:</label>
                <input 
                    id="corpus-input" 
                    className='full-width'
                    type="text" 
                    autoComplete='off'
                    onBlur={e => setCorpusElement(e.target.value)} />
                <button type='button' onClick={addResult}>Add</button>
                <button type='button' onClick={buildModel}>Build Model</button>
            </form>
            <CorpusContainer corpus={corpus} />

        </section>

    )
}

const CorpusContainer = ({ corpus }: { corpus: AppChildrenPropTypes['corpusForm']['corpus']}) => {
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