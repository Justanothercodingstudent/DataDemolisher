from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Event, Match
from ..schemas import EventOut, IngestionResponse, MatchOut
from ..services.ingestion import ingest_event

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
def list_events(year: int | None = None, db: Session = Depends(get_db)):
    stmt = select(Event)
    if year:
        stmt = stmt.where(Event.year == year)
    return list(db.scalars(stmt.order_by(Event.start_date)).all())


@router.get("/{event_key}", response_model=EventOut)
def get_event(event_key: str, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.event_key == event_key))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.get("/{event_key}/matches", response_model=list[MatchOut])
def list_matches(event_key: str, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.event_key == event_key))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    matches = db.scalars(select(Match).where(Match.event_id == event.id).order_by(Match.comp_level, Match.match_number)).all()
    return list(matches)


@router.post("/{event_key}/refresh", response_model=IngestionResponse)
async def refresh_event(event_key: str, db: Session = Depends(get_db)):
    inserted = await ingest_event(db, event_key)
    return IngestionResponse(status="ok", event_key=event_key, inserted=inserted)
