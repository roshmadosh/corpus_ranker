from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
import nltk
import numpy as np
from typing import List
import string
import pickle
from models import S3Accessor

stemmer = nltk.stem.PorterStemmer()

def _tokenizer(sentence: str):
    punc_removed = list()
    for word in sentence.split():
        for punc in string.punctuation:
            word = word.replace(punc, '')
        punc_removed.append(word)
    
    stemmed = [stemmer.stem(word) for word in punc_removed]
    return stemmed

class Vectorizer:
    def __init__(self, accessor: S3Accessor) -> None:
        self.accessor = accessor

    def build_models(self, corpus, tfidf_params, nn_params):
        
        tfidf = self._generate_tfidf(tfidf_params=tfidf_params)
        corpus_transformed = tfidf.fit_transform(corpus)

        nn_model = self._generate_nn(n_neighbors=len(corpus), nn_params=nn_params)
        # do the same for nearest neighbors

        nn_model.fit(corpus_transformed)

        # persist to s3
        try:    
            self._persist_models_to_s3(tfidf, nn_model)
        except Exception as e:
            print("Error in Vectorizer.py, build_models(). See logs...")
            raise e


    def rank_corpus(self, user_input: str, corpus: List[str], tfidf, nn) -> List[str]:
        # vectorize user input
        user_input_vectorized = tfidf.transform(np.array([user_input]))

        # run nearest neighbors model   
        _, neighbor_ind = nn.kneighbors(user_input_vectorized)

        # above index is given as an array
        neighbor_indices = neighbor_ind[0]

        # rank corpus
        rankings = [corpus[ind] for ind in neighbor_indices]
        return rankings


    def import_models(self) -> List:
        
        try:  
            tfidf_raw = self.accessor.read_from_bucket('tfidf_model.pickle')
            nn_raw = self.accessor.read_from_bucket('nn_model.pickle')

            tfidf_model = pickle.loads(tfidf_raw.read())[0]
            nn_model = pickle.loads(nn_raw.read())[0]
            
        except Exception as e:
            print('ERROR in Vectorizor.py, import_models(), see logs.')
            raise e
        
        return [tfidf_model, nn_model]


    def _persist_models_to_s3(self, tfidf_model, nn_model):
        self.accessor.write_to_bucket('tfidf_model.pickle', pickle.dumps([tfidf_model]))
        self.accessor.write_to_bucket('nn_model.pickle', pickle.dumps([nn_model]))

    def _generate_tfidf(self, tfidf_params):
        # extract params
        stop_words = tfidf_params.get('stopWords', None)
        stop_words = 'english' if stop_words else None
        analyzer = tfidf_params.get('analyzer', 'word')
        tokenizer = _tokenizer if analyzer == 'word' else None
        ngram_range = tuple(tfidf_params.get('ngramRange', (1,1)))

        # fit model
        tfidf = TfidfVectorizer(stop_words=stop_words, analyzer=analyzer, tokenizer=tokenizer, ngram_range=ngram_range)

        # return model
        return tfidf

    def _generate_nn(self, n_neighbors, nn_params):
        # extract params
        metric = nn_params.get('metric', 'cosine')

        nn_model = NearestNeighbors(n_neighbors=n_neighbors, metric=metric)

        return nn_model


