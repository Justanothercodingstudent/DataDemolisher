"""Background job placeholders for ingestion and analytics pipelines."""

from datetime import datetime


def refresh_event_task(event_key: str) -> dict:
    return {"status": "queued", "eventKey": event_key, "queuedAt": datetime.utcnow().isoformat()}


def rerun_pipeline_task(pipeline_key: str) -> dict:
    return {"status": "queued", "pipelineKey": pipeline_key, "queuedAt": datetime.utcnow().isoformat()}
