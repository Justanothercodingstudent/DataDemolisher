from datetime import datetime

from fastapi import APIRouter

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


@router.post("/run/{pipeline_key}")
def run_pipeline(pipeline_key: str):
    return {
        "status": "queued",
        "pipelineKey": pipeline_key,
        "runId": f"run_{pipeline_key}_{int(datetime.utcnow().timestamp())}",
        "engine": "alteryx_orchestrator",
    }
