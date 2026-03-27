from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True)
    team_number: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(255))
    rookie_year: Mapped[int | None] = mapped_column(Integer)
    location: Mapped[str | None] = mapped_column(String(255))


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_key: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    name: Mapped[str] = mapped_column(String(255))
    start_date: Mapped[str | None] = mapped_column(String(32))
    end_date: Mapped[str | None] = mapped_column(String(32))


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(primary_key=True)
    match_key: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    comp_level: Mapped[str] = mapped_column(String(16))
    match_number: Mapped[int] = mapped_column(Integer)
    scheduled_time: Mapped[datetime | None] = mapped_column(DateTime)
    actual_time: Mapped[datetime | None] = mapped_column(DateTime)
    red_teams: Mapped[list[int]] = mapped_column(JSON, default=list)
    blue_teams: Mapped[list[int]] = mapped_column(JSON, default=list)
    red_score: Mapped[int | None] = mapped_column(Integer)
    blue_score: Mapped[int | None] = mapped_column(Integer)

    event: Mapped[Event] = relationship()


class TeamEventStats(Base):
    __tablename__ = "team_event_stats"
    __table_args__ = (UniqueConstraint("team_id", "event_id", name="uq_team_event_stats"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    epa_total: Mapped[float | None] = mapped_column(Float)
    epa_auto: Mapped[float | None] = mapped_column(Float)
    epa_teleop: Mapped[float | None] = mapped_column(Float)
    epa_endgame: Mapped[float | None] = mapped_column(Float)
    reliability_score: Mapped[float | None] = mapped_column(Float)
    consistency_score: Mapped[float | None] = mapped_column(Float)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PitScoutEntry(Base):
    __tablename__ = "pit_scout_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), index=True)
    scout_name: Mapped[str] = mapped_column(String(120))
    drivetrain: Mapped[str | None] = mapped_column(String(120))
    climb_types: Mapped[list[str]] = mapped_column(JSON, default=list)
    can_ground_pickup: Mapped[bool] = mapped_column(Boolean, default=False)
    repair_notes: Mapped[str | None] = mapped_column(Text)
    raw_notes: Mapped[str | None] = mapped_column(Text)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class MatchScoutEntry(Base):
    __tablename__ = "match_scout_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), index=True)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), index=True)
    scout_name: Mapped[str] = mapped_column(String(120))
    auto_actions: Mapped[dict] = mapped_column(JSON, default=dict)
    teleop_actions: Mapped[dict] = mapped_column(JSON, default=dict)
    endgame_result: Mapped[str | None] = mapped_column(String(64))
    defense_effectiveness: Mapped[int | None] = mapped_column(Integer)
    driver_rating: Mapped[int | None] = mapped_column(Integer)
    raw_notes: Mapped[str | None] = mapped_column(Text)
    synced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), index=True)
    match_id: Mapped[int | None] = mapped_column(ForeignKey("matches.id"), nullable=True, index=True)
    prediction_type: Mapped[str] = mapped_column(String(64), index=True)
    payload_json: Mapped[dict] = mapped_column(JSON, default=dict)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    model_version: Mapped[str] = mapped_column(String(64), default="v0")
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
