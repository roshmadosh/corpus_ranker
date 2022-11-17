import React, {useState} from 'react';


export const Predict = () => {
    const ws = new WebSocket("ws://localhost:8000/rank/")
    const [search, setSearch] = useState<string>('');

    ws.onmessage = event => {
        console.log(event)
    }

    return (
        <div className="search-container container">
            <label htmlFor="search-input">Search:</label>
            <input 
                type="text" 
                id="search-input"
                onChange={e => ws.send(e.target.value)}
            />
        </div>
    )
}