from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.diagnostics import router


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


# Routes
app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"status": "Backend Running"}
