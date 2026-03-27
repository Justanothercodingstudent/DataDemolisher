from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Event, Match, MatchScoutEntry, PitScoutEntry, Team
from ..schemas import MatchScoutCreate, PitScoutCreate

router = APIRouter(prefix="/scouting", tags=["scouting"])


@router.post("/pit")
def create_pit_entry(payload: PitScoutCreate, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.event_key == payload.event_key))
    team = db.scalar(select(Team).where(Team.team_number == payload.team_number))
    if not event or not team:
        raise HTTPException(status_code=404, detail="Event or team not found")

    entry = PitScoutEntry(
        event_id=event.id,
        team_id=team.id,
        scout_name=payload.scout_name,
        drivetrain=payload.drivetrain,
        climb_types=payload.climb_types,
        can_ground_pickup=payload.can_ground_pickup,
        repair_notes=payload.repair_notes,
        raw_notes=payload.raw_notes,
    )
    db.add(entry)
    db.commit()
    return {"status": "ok", "id": entry.id}


@router.post("/match")
def create_match_entry(payload: MatchScoutCreate, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.event_key == payload.event_key))
    team = db.scalar(select(Team).where(Team.team_number == payload.team_number))
    match = db.scalar(select(Match).where(Match.match_key == payload.match_key))
    if not event or not team or not match:
        raise HTTPException(status_code=404, detail="Event, team, or match not found")

    entry = MatchScoutEntry(
        event_id=event.id,
        match_id=match.id,
        team_id=team.id,
        scout_name=payload.scout_name,
        auto_actions=payload.auto_actions,
        teleop_actions=payload.teleop_actions,
        endgame_result=payload.endgame_result,
        defense_effectiveness=payload.defense_effectiveness,
        driver_rating=payload.driver_rating,
        raw_notes=payload.raw_notes,
        synced_at=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    return {"status": "ok", "id": entry.id}
