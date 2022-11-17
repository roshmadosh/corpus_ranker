import React, {useState} from 'react';

export const Results = () => {
    const [results, setResults] = useState<string[]>([]);
    const [result, setResult] = useState<string>('');


    const addResult = (e: any): void => {
        e.preventDefault();
        const updatedResults = [...results, result];
        setResults(updatedResults);
    }

    return (
        <>
            <form className="add_result-container container" onSubmit={e => addResult(e)}>
                <label htmlFor="add_result-input">Add a result here:</label>
                <input id="add_result-input" type="text" onBlur={e => setResult(e.target.value)} />
                <button type='submit'>Add</button>
            </form>
            <div className="results-container container">
                {results.map(result => (
                    <p>{result}</p>
                ))}
            </div>
        </>

    )
}
