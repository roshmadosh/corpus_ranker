from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string
import pickle
import json
from utils import create_dir_if_none

stemmer = nltk.stem.PorterStemmer()


def build_models(corpus, tfidf_args, nn_args):
    # get user-determined hyperparameters for tfidf
    stop_words = tfidf_args.get('stop_words', None)
    analyzer = tfidf_args.get('analyzer', 'word')
    tokenizer = _tokenizer if analyzer == 'word' else None
    ngram_range = tfidf_args.get('ngram_range', (1,1))

    # do the same for nearest neighbors
    metric = nn_args.get('metric', 'cosine')

    tfidf = TfidfVectorizer(stop_words=stop_words, analyzer=analyzer, tokenizer=tokenizer, ngram_range=ngram_range)
    corpus_transformed = tfidf.fit_transform(corpus)
    nn_model = NearestNeighbors(n_neighbors=len(corpus), metric=metric)
    nn_model.fit(corpus_transformed)

    create_dir_if_none(['pickle_jar'])

    with open('pickle_jar/nn_model.pickle', 'wb') as output_file:
        pickle.dump(nn_model, output_file)
 
    with open('pickle_jar/tfidf_model.pickle', 'wb') as output_file:
        pickle.dump(tfidf, output_file)
    
    with open('pickle_jar/corpus.txt', 'w') as output_file:
        output_file.write(json.dumps(corpus))


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
