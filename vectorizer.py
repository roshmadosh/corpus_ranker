from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string
import pickle
import json

stemmer = nltk.stem.PorterStemmer()


def build_models(results: List[str]):
    tfidf = TfidfVectorizer(tokenizer=_tokenizer, stop_words='english')
    results_transformed = tfidf.fit_transform(results)
    nn_model = NearestNeighbors(n_neighbors=len(results), metric='cosine')
    nn_model.fit(results_transformed)

    with open('pickle_jar/nn_model.pickle', 'wb') as output_file:
        pickle.dump(nn_model, output_file)
 

    with open('pickle_jar/tfidf_model.pickle', 'wb') as output_file:
        pickle.dump(tfidf, output_file)
    
    with open('pickle_jar/corpus.txt', 'w') as output_file:
        output_file.write(json.dumps(results))


def rank_results(user_input: str, corpus: List[str], tfidf, nn) -> List[str]:
        
    # vectorize user input
    user_input_vectorized = tfidf.transform(np.array([user_input]))

    # run nearest neighbors model   
    _, neighbor_ind = nn.kneighbors(user_input_vectorized)

    # above index is given as an array
    neighbor_indices = neighbor_ind[0]

    # rank corpus
    rankings = [corpus[ind] for ind in neighbor_indices]

    return rankings


def import_models() -> List:
    # import models from pickle files
    with open('pickle_jar/tfidf_model.pickle', 'rb') as tfidf_file:
        tfidf_model = pickle.load(tfidf_file)
    
    with open('pickle_jar/nn_model.pickle', 'rb') as nn_file:
        nn_model = pickle.load(nn_file)

    with open('pickle_jar/corpus.txt', 'r') as corpus_file:
        corpus = json.loads(corpus_file.read())
    
    return [tfidf_model, nn_model, corpus]


def _tokenizer(sentence: str):
    punc_removed = list()
    for word in sentence.split():
        for punc in string.punctuation:
            word = word.replace(punc, '')
        punc_removed.append(word)
    
    stemmed = [stemmer.stem(word) for word in punc_removed]
    return stemmed
