import React from 'react';
import { AppChildrenPropTypes } from '../App';


export const Predict = ({ corpus, websocket, setToast }: AppChildrenPropTypes['predict']) => {

    websocket.onmessage = event => {
        const { data } = event;
        const response_obj = JSON.parse(data);
        const { success, message, ranks } = response_obj
        
        if (success) {
            console.log(ranks)
            console.log(typeof ranks)
        } else {
            setToast({ success, message })
        }
    }

    const rankCorpus = (e: any) => {
        const corpus_obj = {
            userInput: e.target.value, 
            corpus: corpus
        }
        websocket.send(JSON.stringify(corpus_obj))
    }

    return (
        <div className="search-container container">
            <label htmlFor="search-input">Search:</label>
            <input 
                type="text" 
                id="search-input"
                autoComplete="off"
                onChange={e => rankCorpus(e)}
            />
        </div>
    )
}