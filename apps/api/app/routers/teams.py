from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Team, TeamEventStats, Event
from ..schemas import TeamOut

router = APIRouter(prefix="/teams", tags=["teams"])


@router.get("/{team_number}", response_model=TeamOut)
def get_team(team_number: int, db: Session = Depends(get_db)):
    team = db.scalar(select(Team).where(Team.team_number == team_number))
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/{team_number}/event/{event_key}")
def team_event_summary(team_number: int, event_key: str, db: Session = Depends(get_db)):
    team = db.scalar(select(Team).where(Team.team_number == team_number))
    event = db.scalar(select(Event).where(Event.event_key == event_key))
    if not team or not event:
        raise HTTPException(status_code=404, detail="Team or event not found")

    stats = db.scalar(
        select(TeamEventStats).where(
            TeamEventStats.team_id == team.id,
            TeamEventStats.event_id == event.id,
        )
    )
    return {
        "team": TeamOut.model_validate(team),
        "eventKey": event_key,
        "stats": {
            "epaTotal": stats.epa_total if stats else None,
            "epaAuto": stats.epa_auto if stats else None,
            "epaTeleop": stats.epa_teleop if stats else None,
            "epaEndgame": stats.epa_endgame if stats else None,
            "reliability": stats.reliability_score if stats else None,
            "consistency": stats.consistency_score if stats else None,
        },
    }
