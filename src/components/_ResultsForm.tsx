import React, {useState} from 'react';
import { AppChildrenPropTypes } from '../App';

export const ResultsForm = ({ results , setResults, setToast }: AppChildrenPropTypes['resultsForm']) => {

    const [result, setResult] = useState<string>('');


    const addResult = (e: any): void => {
        e.preventDefault()
        const updatedResults = [...results, result];
        setResults(updatedResults);
    }

    const buildModel = async () => {
        const response_obj = await fetch('http://localhost:8000/model', {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(results)
            })
        const response = await response_obj.json();
 
        setToast({ success: response.success, message: response.message })
        
    }

    return (
        <>
            <form className="add_result-container container" onSubmit={e => addResult(e)}>
                <label htmlFor="add_result-input">Add a result here:</label>
                <input 
                id="add_result-input" 
                type="text" 
                autoComplete='off'
                onBlur={e => setResult(e.target.value)} />
                <button type='submit'>Add</button>
            </form>
            <div className="results-container container">
                {results.map(result => (
                    <p>{result}</p>
                ))}
            </div>
            <button onClick={buildModel}>Build Model</button>
        </>

    )
}
