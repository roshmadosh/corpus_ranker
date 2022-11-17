import React, {useState} from 'react';

export const Results = () => {
    const [results, setResults] = useState<string[]>([]);
    const [result, setResult] = useState<string>('');

    const onBlurHandler = (e: any): void => {
        console.log(typeof(e));
        setResult(e.target.value);
        // const updatedResults = [...results, result];
        // setResults(updatedResults);
    }

    const addResult = (): void => {
        const updatedResults = [...results, result];
        setResults(updatedResults);
    }

    return (
        <>
            <div className="add_result-container container">
                <label htmlFor="add_result-input">Add a result here:</label>
                <input id="add_result-input" type="text" onBlur={(e) => onBlurHandler(e)} />
                <button onClick={addResult}>Add</button>
            </div>
            <div className="results-container container">
                {results.map(result => (
                    <p>{result}</p>
                ))}
            </div>
        </>

    )
}
