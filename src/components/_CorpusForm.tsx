import React, {useState} from 'react';
import { AppChildrenPropTypes } from '../App';


export const CorpusForm = ({ corpus , setCorpus, setToast }: AppChildrenPropTypes['corpusForm']) => {

    const [corpusElement, setCorpusElement] = useState<string>('');

    const addResult = () => {
        const updatedCorpus = [...corpus, corpusElement];
        setCorpus(updatedCorpus);
    }

    const buildModel = async () => {
        const response_obj = await fetch('http://localhost:8000/model', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corpus)
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
            <div className="corpus-container">
                {corpus.map((content, idx) => (
                    <CorpusElement content={content} idx={idx} />
                ))}
            </div>

        </section>

    )
}

const CorpusElement = ({ content, idx }: { content: string, idx: number }) => {
    return (
        <div className={`corpus-element full-width ce-${idx}`}>{content}</div>
    )
}