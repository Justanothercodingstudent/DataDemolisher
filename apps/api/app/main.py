from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import analytics, events, picklists, pipelines, scouting, teams

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataDemolisher API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(teams.router)
app.include_router(scouting.router)
app.include_router(analytics.router)
app.include_router(pipelines.router)
app.include_router(picklists.router)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}
