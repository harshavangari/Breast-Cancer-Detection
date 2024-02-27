from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import cv2
#from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#print("Current working directory:", os.getcwd())
MODEL = tf.keras.models.load_model("./saved_model")

origins = [
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return "hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(... )):
    print(type(file))
    image = read_file_as_image(await file.read())
    image = cv2.resize(image, dsize=(128,128), interpolation=cv2.INTER_LANCZOS4)
    print(image.shape)
    input_tensor = tf.convert_to_tensor(image)
    input_tensor = input_tensor[tf.newaxis, ...]
    tf.reshape(input_tensor, [128,128,3])
    prediction = MODEL.predict(input_tensor)
    print(f'prediction {prediction}')
    return JSONResponse({
        "prediction": int(prediction[0][0])
    })

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=5000)