from fastapi import FastAPI, Request, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import List
from vectorizer import build_models, rank_results, import_models
from models import ResponseBody
import datetime
from utils import create_dir_if_none
models = list()

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/', response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse('index.html', { "request": request })


@app.post('/model/')
async def model_builder(results: List[str]):
    try:
        build_models(results)
        return ResponseBody(True, "Models successfully built.").jsonify()
    except Exception as e:
        print('ERROR:', e)
        create_dir_if_none(['logs'])
        with open(f'logs/{datetime.date.today()}.txt', 'w+') as file:
            file.write(f'{datetime.datetime.now()}: {e}')
        return ResponseBody(False, 'Something went wrong. Please see server logs.').jsonify()
    


@app.websocket("/rank/")
async def rank(websocket: WebSocket):
    await websocket.accept()
    while True:
        results_obj = await websocket.receive_json()

        # TODO store these statically
        tfidf, nn, corpus = import_models()
        user_input = results_obj.get('userInput', '')

        if not user_input: 
            continue

        try:
            ranks = rank_results(user_input, corpus, tfidf=tfidf, nn=nn)
            await websocket.send_json(ResponseBody(True, "Results successfully ranked!", ranks=ranks).jsonify())
        except BaseException as e:
            await websocket.send_json(ResponseBody(False, e))


