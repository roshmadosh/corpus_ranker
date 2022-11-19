from pydantic import BaseModel
from typing import List

class ModelBuilderParams(BaseModel):
    corpus: List[str]
    tfidf_args: dict = dict()
    nn_args: dict = dict()