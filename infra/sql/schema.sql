-- Canonical starter schema for DataDemolisher.
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  team_number INT UNIQUE NOT NULL,
  name TEXT,
  rookie_year INT,
  location TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_key TEXT UNIQUE NOT NULL,
  year INT NOT NULL,
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  match_key TEXT UNIQUE NOT NULL,
  event_id INT NOT NULL REFERENCES events(id),
  comp_level TEXT NOT NULL,
  match_number INT NOT NULL,
  red_teams JSONB NOT NULL DEFAULT '[]'::jsonb,
  blue_teams JSONB NOT NULL DEFAULT '[]'::jsonb,
  red_score INT,
  blue_score INT
);

CREATE TABLE IF NOT EXISTS match_scout_entries (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id),
  match_id INT NOT NULL REFERENCES matches(id),
  team_id INT NOT NULL REFERENCES teams(id),
  scout_name TEXT NOT NULL,
  auto_actions JSONB NOT NULL DEFAULT '{}'::jsonb,
  teleop_actions JSONB NOT NULL DEFAULT '{}'::jsonb,
  endgame_result TEXT,
  defense_effectiveness INT,
  driver_rating INT,
  raw_notes TEXT,
  synced_at TIMESTAMP NOT NULL DEFAULT NOW()
);
