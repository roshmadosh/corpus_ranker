import os
from typing import List


def create_dir_if_none(dirnames: List[str]):
    for dir in dirnames:       
        path = f'./{dir}'
        exists = os.path.exists(path)
        if not exists:
            os.makedirs(path)
            print(f'Created directory {dir}.')
        else:
            print(f'{dir} already exists.')