from fastapi import FastAPI, Request, WebSocket, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from models import ResponseBody, ModelBuilderParams, S3Accessor, Vectorizer
from utils import write_log


app = FastAPI()


app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/', response_class=HTMLResponse)
def read_root(request: Request):
    
    return templates.TemplateResponse('index.html', { "request": request })

@app.post('/cookie')
def get_cookie(response: Response):
    s3 = S3Accessor()
    id = s3.get_last_id() + 1
    response.set_cookie(key="user_id", value=id, expires=1000000)
    return ResponseBody(True, 'Set cookie for user.', cookie=id).jsonify()

@app.post('/model/')
async def model_builder(args: ModelBuilderParams):
    try:
        user_id = args.dict()['user_id']
        args = [val for key, val in args.dict().items() if key != "user_id"]
        s3_accessor = S3Accessor(user_id=user_id)
        vectorizer = Vectorizer(accessor = s3_accessor)

        vectorizer.build_models(*args)

        return ResponseBody(True, "Models successfully built.").jsonify()

    except Exception as e:
        print('ERROR:', e)
        write_log(e)
        return ResponseBody(False, 'Something went wrong. Please see server logs.').jsonify()
    


@app.websocket("/rank/{user_id}")
async def rank(websocket: WebSocket, user_id: str):
    await websocket.accept()
    s3_accessor = S3Accessor(user_id=user_id)
    vectorizer = Vectorizer(s3_accessor)
    # attempt to make models "static" after first fetch
    tfidf = None
    nn = None

    while True:
        results_obj = await websocket.receive_json()

        # destructure results dict
        corpus = results_obj.get('corpus', [])
        user_input = results_obj.get('userInput', '')


        try:
            if not user_id:
                raise Exception('No user id')
            if not user_input: 
                continue

            # fetch models from S3, if needed
            if not tfidf or not nn:
                tfidf, nn = vectorizer.import_models()

        except Exception as e:
            write_log(e)
            print("ERROR in main.py, rank():", e)
            return

        # run models
        try:
            ranks = vectorizer.rank_corpus(user_input, corpus, tfidf=tfidf, nn=nn)
            await websocket.send_json(ResponseBody(True, "Results successfully ranked!", ranks=ranks).jsonify())
        except BaseException as e:
            await websocket.send_json(ResponseBody(False, "Something went wrong while ranking corpus. See logs.").jsonify())
            write_log(e)

