from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string
import pickle

stemmer = nltk.stem.PorterStemmer()

X_train = ['This is a sentence', 'A dog walks', 'Walking cat.', "talk'ing cat"]

def build_model(results: List[str]):
    tfidf = TfidfVectorizer(tokenizer=tokenizer, stop_words='english')
    results_transformed = tfidf.fit_transform(results)
    nn_model = NearestNeighbors(n_neighbors=len(results), metric='cosine')
    nn_model.fit(results_transformed)

    with open('nn_model.pickle', 'wb') as output_file:
        pickle.dump(nn_model, output_file)

    with open('tfidf_model.pickle', 'wb') as output_file:
        pickle.dump(tfidf, output_file)

    test = np.array(['I like cats'])
    test_transformed = tfidf.transform(test)

    _, neighbor_ind = nn_model.kneighbors(test_transformed)

    neighbor_ind = neighbor_ind[0]

    nearest_trained = [results[ind] for ind in neighbor_ind]

    print(nearest_trained)


def tokenizer(sentence: str):
    punc_removed = list()
    for word in sentence.split():
        for punc in string.punctuation:
            word = word.replace(punc, '')
        punc_removed.append(word)
    
    stemmed = [stemmer.stem(word) for word in punc_removed]
    return stemmed
