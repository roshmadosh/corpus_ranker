from fastapi import FastAPI, Request, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from typing import List
from vectorizer import build_model
from models import ResponseBody
# from analyzer import analyze_text

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')
templates = Jinja2Templates(directory='templates')

@app.get('/', response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse('index.html', { "request": request })


@app.post('/model/')
async def model_builder(results: List[str]):
    try:
        build_model(results)
        return ResponseBody(True, "Models successfully built.").jsonify()
    except BaseException as e:
        return ResponseBody(True, e).jsonify()

@app.websocket("/rank/")
async def rank(websocket: WebSocket):
    await websocket.accept()
    while True:
        request = await websocket.receive_text()
        print(request)
        await websocket.send_text(request)
        # result = analyze_text(request)
        # serialized = [str(val) for val in result['scores']]
        # await websocket.send_json({
        #     "text": result['text'],
        #     "NEGATIVE": serialized[0],
        #     "NEUTRAL": serialized[1],
        #     "POSITIVE": serialized[2]
        # })

