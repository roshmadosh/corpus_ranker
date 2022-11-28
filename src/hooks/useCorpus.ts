import { useState, useEffect, useRef } from 'react';
import { useFlag } from './useFlag';
import { getCookie, setCookie } from "../utils";

async function getUserId() {
    let user_id = getCookie('user_id');
        
    if (!user_id)   
        user_id = await setCookie();

    return user_id;
}

export const useCorpus = () => {
    const [corpus, setCorpus] = useState<useCorpusType['corpus']>([]);
    const [tfidfParams, setTfidfParams] = useState<Partial<TfidfParamsType>>(DEFAULT_TFIDF_PARAMS);
    const [nnParams, setNnParams] = useState<NnParamsType>(DEFAULT_NN_PARAMS);
    const [userId, setUserId] = useState<String | undefined>("")
    const webSocketRef = useRef<WebSocket | null>(null);

    const { updateFlag } = useFlag();

    useEffect(() => {
        getUserId()
            .then(id => {
                setUserId(id); 
                webSocketRef.current = new WebSocket(`ws://localhost:8000/rank/${id ?? ""}`)

                webSocketRef.current.onmessage = event => {
                    const { data } = event;
                    const response_obj = JSON.parse(data);
                    const { success, message, ranks } = response_obj
                    
                    if (success) {
                        setCorpus(ranks);
                    } else {
                        updateFlag({ success, message });
                    }
                }
            });
        }
    , [])



    const addCorpusElement = (corpusElement: CorpusElementType) => {
        const updatedCorpus = [...corpus, corpusElement];
        setCorpus(updatedCorpus);
    }

    const removeCorpusElement = (corpusElement: CorpusElementType) => {
        setCorpus(corpus.filter(element => element != corpusElement));
    }

    const updateTfidfParams = (params: Partial<TfidfParamsType>) => {
        setTfidfParams({ ...tfidfParams, ...params });
    }

    const updateNnParams = (params: Partial<NnParamsType>) => {
        setNnParams({ ...nnParams, ...params });
    }

    const buildModel = async () => {

        // save corpus to local storage
        localStorage.setItem('corpus-ranker_corpus', JSON.stringify(corpus));


        // send corpus to model-builder API endpoint
        const request_body = {
            user_id: userId,
            corpus,
            tfidf_params: tfidfParams
        }
        
        const response_obj = await fetch('http://localhost:8000/model', {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request_body)
        })
        

        const response = await response_obj.json();
 
        updateFlag({ success: response.success, message: response.message })   
    }

    const rankCorpus = (userInput: string) => {
        const corpus = localStorage.getItem('corpus-ranker_corpus') ?? '[]';
        const userId = getCookie('user_id')

        const corpus_obj = {
            userId,
            userInput,
            corpus: JSON.parse(corpus)
        }
        webSocketRef.current!.send(JSON.stringify(corpus_obj))
    }

    return {
        corpus, 
        addCorpusElement, 
        removeCorpusElement, 
        buildModel, 
        rankCorpus, 
        updateTfidfParams,
        updateNnParams
    } as useCorpusType;
}


export type useCorpusType = {
    corpus: CorpusElementType[],
    addCorpusElement: (corpusElement: CorpusElementType) => void,
    removeCorpusElement: (corpusElement: CorpusElementType) => void,
    buildModel: () => void,
    rankCorpus: (userInput: string) => void,
    updateTfidfParams: (params: Partial<TfidfParamsType>) => void,
    updateNnParams: (params: Partial<NnParamsType>) => void,
}

export type CorpusElementType = string

type TfidfParamsType = {
    stopWords: boolean,
    ngramRange: [number, number],
    analyzer: string
}

type NnParamsType = {
    metric: string
}

const DEFAULT_TFIDF_PARAMS: TfidfParamsType = {
    stopWords: false,
    ngramRange: [1,1],
    analyzer: 'word'
}

const DEFAULT_NN_PARAMS: NnParamsType = {
    metric: 'cosine'
}