from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.diagnostics import router as diagnostics_router

app = FastAPI(title="AUTOMIND Backend")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ API routes
app.include_router(diagnostics_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "AUTOMIND backend running"}
