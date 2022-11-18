import React, {useState} from 'react';
import { AppChildrenPropTypes } from '../App';

export const CorpusForm = ({ corpus , setCorpus, setToast }: AppChildrenPropTypes['corpusForm']) => {

    const [corpusElement, setCorpusElement] = useState<string>('');


    const addResult = (e: any): void => {
        e.preventDefault()
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
        <>
            <form className="add_result-container container" onSubmit={e => addResult(e)}>
                <label htmlFor="add_result-input">Add to corpus:</label>
                <input 
                id="add_result-input" 
                type="text" 
                autoComplete='off'
                onBlur={e => setCorpusElement(e.target.value)} />
                <button type='submit'>Add</button>
            </form>
            <div className="corpus-container container">
                {corpus.map(result => (
                    <p>{result}</p>
                ))}
            </div>
            <button onClick={buildModel}>Build Model</button>
        </>

    )
}
