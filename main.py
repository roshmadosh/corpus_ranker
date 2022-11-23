from fastapi import FastAPI, Request, WebSocket, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from vectorizer import build_models, rank_corpus, import_models
import datetime
from models import ResponseBody, ModelBuilderParams, S3Accessor
from utils import write_log


app = FastAPI()


app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/', response_class=HTMLResponse)
def read_root(request: Request):
    
    return templates.TemplateResponse('index.html', { "request": request })

@app.post('/cookie')
def get_cookie(response: Response):
    #TODO
    # s3 = S3Accessor()
    # s3.get_last_id()
    response.set_cookie(key="user_id", value=5, expires=1000000)
    return ResponseBody(True, 'Set cookie for user.').jsonify()

@app.post('/model/')
async def model_builder(args: ModelBuilderParams):
    try:
        build_models(**args.dict())
        return ResponseBody(True, "Models successfully built.").jsonify()
    except Exception as e:
        print('ERROR:', e)
        write_log(e)
        return ResponseBody(False, 'Something went wrong. Please see server logs.').jsonify()
    


@app.websocket("/rank/")
async def rank(websocket: WebSocket):
    await websocket.accept()

    # attempt to make models "static" after first fetch
    tfidf = None
    nn = None

    while True:
        results_obj = await websocket.receive_json()

        # destructure results dict
        user_id = results_obj.get('userId', 1)
        corpus = results_obj.get('corpus', [])
        user_input = results_obj.get('userInput', '')
        if not user_id:
            print('NO USER ID')
        if not user_input: 
            continue

        # fetch models from S3, if needed
        try:
            if not tfidf or not nn:
                tfidf, nn = import_models(user_id=user_id)

        except Exception as e:
            write_log(e)
            print("ERROR in main.py, rank():", e)
            return

        # run models
        try:
            ranks = rank_corpus(user_input, corpus, tfidf=tfidf, nn=nn)
            await websocket.send_json(ResponseBody(True, "Results successfully ranked!", ranks=ranks).jsonify())
        except BaseException as e:
            await websocket.send_json(ResponseBody(False, "Something went wrong while ranking corpus. See logs.").jsonify())
            write_log(e)

