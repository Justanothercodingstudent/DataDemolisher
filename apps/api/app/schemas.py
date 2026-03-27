from datetime import datetime

from pydantic import BaseModel, Field


class TeamOut(BaseModel):
    team_number: int
    name: str | None = None
    rookie_year: int | None = None
    location: str | None = None

    model_config = {"from_attributes": True}


class EventOut(BaseModel):
    event_key: str
    year: int
    name: str
    start_date: str | None = None
    end_date: str | None = None

    model_config = {"from_attributes": True}


class MatchOut(BaseModel):
    match_key: str
    comp_level: str
    match_number: int
    red_teams: list[int]
    blue_teams: list[int]
    red_score: int | None = None
    blue_score: int | None = None

    model_config = {"from_attributes": True}


class PitScoutCreate(BaseModel):
    event_key: str
    team_number: int
    scout_name: str
    drivetrain: str | None = None
    climb_types: list[str] = Field(default_factory=list)
    can_ground_pickup: bool = False
    repair_notes: str | None = None
    raw_notes: str | None = None


class MatchScoutCreate(BaseModel):
    event_key: str
    match_key: str
    team_number: int
    scout_name: str
    auto_actions: dict = Field(default_factory=dict)
    teleop_actions: dict = Field(default_factory=dict)
    endgame_result: str | None = None
    defense_effectiveness: int | None = None
    driver_rating: int | None = None
    raw_notes: str | None = None


class IngestionResponse(BaseModel):
    status: str
    event_key: str
    inserted: dict


class PredictionOut(BaseModel):
    prediction_type: str
    payload_json: dict
    confidence: float
    model_version: str
    generated_at: datetime

    model_config = {"from_attributes": True}
