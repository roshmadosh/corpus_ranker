from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string
import pickle
import json
from models import S3Accessor

stemmer = nltk.stem.PorterStemmer()


def build_models(user_id, corpus, tfidf_params, nn_params):
    # get user-determined hyperparameters for tfidf
    stop_words = tfidf_params.get('stopWords', None)
    stop_words = 'english' if stop_words else None
    analyzer = tfidf_params.get('analyzer', 'word')
    tokenizer = _tokenizer if analyzer == 'word' else None
    ngram_range = tuple(tfidf_params.get('ngramRange', (1,1)))

    # do the same for nearest neighbors
    metric = nn_params.get('metric', 'cosine')

    tfidf = TfidfVectorizer(stop_words=stop_words, analyzer=analyzer, tokenizer=tokenizer, ngram_range=ngram_range)
    corpus_transformed = tfidf.fit_transform(corpus)
    nn_model = NearestNeighbors(n_neighbors=len(corpus), metric=metric)
    nn_model.fit(corpus_transformed)

    # persist to s3
    try:    
        _persist_models(user_id, tfidf, nn_model)
    except Exception as e:
        raise e


def rank_corpus(user_input: str, corpus: List[str], tfidf, nn) -> List[str]:
    # vectorize user input
    user_input_vectorized = tfidf.transform(np.array([user_input]))

    # run nearest neighbors model   
    _, neighbor_ind = nn.kneighbors(user_input_vectorized)

    # above index is given as an array
    neighbor_indices = neighbor_ind[0]

    # rank corpus
    rankings = [corpus[ind] for ind in neighbor_indices]
    return rankings


def import_models(user_id) -> List:
    s3_accessor = S3Accessor(user_id=user_id)
    
    # import models from pickle files
    try:
        tfidf_raw = s3_accessor.read_from_bucket('tfidf_model.pickle')
        nn_raw = s3_accessor.read_from_bucket('nn_model.pickle')

        tfidf_model = pickle.loads(tfidf_raw.read())[0]
        nn_model = pickle.loads(nn_raw.read())[0]
        
    except Exception as e:
        print('ERROR in vectorizor.py, import_models(), see logs.')
        raise e
    
    return [tfidf_model, nn_model]


def _tokenizer(sentence: str):
    punc_removed = list()
    for word in sentence.split():
        for punc in string.punctuation:
            word = word.replace(punc, '')
        punc_removed.append(word)
    
    stemmed = [stemmer.stem(word) for word in punc_removed]
    return stemmed

def _persist_models(user_id: str, tfidf_model, nn_model):
    s3_accessor = S3Accessor(user_id=user_id)

    s3_accessor.write_to_bucket('tfidf_model.pickle', pickle.dumps([tfidf_model]))
    s3_accessor.write_to_bucket('nn_model.pickle', pickle.dumps([nn_model]))

