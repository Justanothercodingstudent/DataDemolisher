from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Event, Match, Prediction, Team, TeamEventStats
from ..services.analytics import mock_match_prediction

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/match/{match_key}/preview")
def match_preview(match_key: str, db: Session = Depends(get_db)):
    match = db.scalar(select(Match).where(Match.match_key == match_key))
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    def alliance_strength(team_numbers: list[int]) -> float:
        strengths: list[float] = []
        for team_number in team_numbers:
            team = db.scalar(select(Team).where(Team.team_number == team_number))
            if not team:
                continue
            stats = db.scalar(
                select(TeamEventStats).where(
                    TeamEventStats.team_id == team.id,
                    TeamEventStats.event_id == match.event_id,
                )
            )
            if stats and stats.epa_total:
                strengths.append(stats.epa_total)
        return sum(strengths) if strengths else 1.0

    prediction = mock_match_prediction(alliance_strength(match.red_teams), alliance_strength(match.blue_teams))
    return {
        "matchKey": match_key,
        **prediction,
        "swingFactors": ["Auto consistency", "Endgame conversion", "Defense pressure"],
    }


@router.get("/event/{event_key}/predictions")
def list_event_predictions(event_key: str, db: Session = Depends(get_db)):
    event = db.scalar(select(Event).where(Event.event_key == event_key))
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    rows = db.scalars(select(Prediction).where(Prediction.event_id == event.id).order_by(Prediction.generated_at.desc())).all()
    return rows
