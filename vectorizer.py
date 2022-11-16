from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string

stemmer = nltk.stem.PorterStemmer()

X_train = ['This is a sentence', 'A dog walks', 'Walking cat.', "talk'ing cat"]

tokenizer = lambda x: [stemmer.stem(word) for word in x.split()]

def tokenizer(sentence: str):
    punc_removed = list()
    for word in sentence.split():
        for punc in string.punctuation:
            word = word.replace(punc, '')
        punc_removed.append(word)
    
    stemmed = [stemmer.stem(word) for word in punc_removed]
    return stemmed


tfidf = TfidfVectorizer(tokenizer=tokenizer, stop_words='english')
X_train_transformed = tfidf.fit_transform(X_train)
nn_model = NearestNeighbors(n_neighbors=len(X_train), metric='cosine')
nn_model.fit(X_train_transformed)


test = np.array(['I like cats'])
test_transformed = tfidf.transform(test)

dist, neighbor_ind = nn_model.kneighbors(test_transformed)

neighbor_ind = neighbor_ind[0]

nearest_trained = [X_train[ind] for ind in neighbor_ind]

print(nearest_trained)



			