from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models  # import models BEFORE create_all
from .routers import auth as auth_router
from .routers import sections as sections_router
from .routers import projects as projects_router
from .routers import export as export_router


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-DOC-PLATFORM Backend")


origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://ai-doc-platform-deploy.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(sections_router.router)
app.include_router(projects_router.router)
app.include_router(export_router.router)


@app.get("/")
def read_root():
    return {"message": "Backend running"}
