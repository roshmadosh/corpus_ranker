from pydantic import BaseModel
from typing import List

class ModelBuilderParams(BaseModel):
    user_id: int = 1
    corpus: List[str]
    tfidf_args: dict = dict()
    nn_args: dict = dict()