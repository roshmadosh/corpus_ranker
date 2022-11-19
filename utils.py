import os
from typing import List
import datetime


def create_dir_if_none(dirnames: List[str]):
    for dir in dirnames:       
        path = f'./{dir}'
        exists = os.path.exists(path)
        if not exists:
            os.makedirs(path)
            print(f'Created directory {dir}.')

def write_log(message):
    create_dir_if_none(['logs'])
    with open(f'logs/{datetime.date.today()}.txt', 'a') as file:
        file.write(f'{datetime.datetime.now()}: {message}\n')