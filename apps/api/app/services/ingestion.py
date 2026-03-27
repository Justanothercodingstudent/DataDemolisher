from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models
from .statbotics import fetch_event_epa
from .tba import fetch_event


def _parse_team_number(team_key: str) -> int:
    return int(team_key.replace("frc", ""))


async def ingest_event(db: Session, event_key: str) -> dict:
    tba_payload = await fetch_event(event_key)
    statbotics_payload = await fetch_event_epa(event_key)

    event_obj = tba_payload["event"]
    event = db.scalar(select(models.Event).where(models.Event.event_key == event_key))
    if not event:
        event = models.Event(
            event_key=event_obj["key"],
            year=event_obj["year"],
            name=event_obj["name"],
            start_date=event_obj.get("start_date"),
            end_date=event_obj.get("end_date"),
        )
        db.add(event)
        db.flush()

    inserted = {"teams": 0, "matches": 0, "epa": 0}

    for t in tba_payload["teams"]:
        team_number = _parse_team_number(t["key"])
        existing = db.scalar(select(models.Team).where(models.Team.team_number == team_number))
        if not existing:
            db.add(
                models.Team(
                    team_number=team_number,
                    name=t.get("nickname"),
                    rookie_year=t.get("rookie_year"),
                    location=t.get("city"),
                )
            )
            inserted["teams"] += 1

    db.flush()

    for m in tba_payload["matches"]:
        existing = db.scalar(select(models.Match).where(models.Match.match_key == m["key"]))
        if existing:
            continue
        db.add(
            models.Match(
                match_key=m["key"],
                event_id=event.id,
                comp_level=m["comp_level"],
                match_number=m["match_number"],
                scheduled_time=datetime.fromtimestamp(m["predicted_time"]) if m.get("predicted_time") else None,
                actual_time=datetime.fromtimestamp(m["actual_time"]) if m.get("actual_time") else None,
                red_teams=[_parse_team_number(x) for x in m["alliances"]["red"]["team_keys"]],
                blue_teams=[_parse_team_number(x) for x in m["alliances"]["blue"]["team_keys"]],
                red_score=m["alliances"]["red"].get("score"),
                blue_score=m["alliances"]["blue"].get("score"),
            )
        )
        inserted["matches"] += 1

    db.flush()

    for s in statbotics_payload:
        team = db.scalar(select(models.Team).where(models.Team.team_number == s["team"]))
        if not team:
            continue
        tes = db.scalar(
            select(models.TeamEventStats).where(
                models.TeamEventStats.team_id == team.id,
                models.TeamEventStats.event_id == event.id,
            )
        )
        if not tes:
            tes = models.TeamEventStats(team_id=team.id, event_id=event.id)
            db.add(tes)
        tes.epa_total = s.get("epa", {}).get("total")
        tes.epa_auto = s.get("epa", {}).get("auto")
        tes.epa_teleop = s.get("epa", {}).get("teleop")
        tes.epa_endgame = s.get("epa", {}).get("endgame")
        tes.updated_at = datetime.utcnow()
        inserted["epa"] += 1

    db.commit()
    return inserted
