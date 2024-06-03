-- Migration number: 0002 	 2024-05-26T07:00:07.227Z

CREATE TABLE IF NOT EXISTS riot_accounts(
  id INTEGER PRIMARY KEY,
  summoner_id TEXT NOT NULL,
  game_name TEXT NOT NULL,
  created_at INTEGER DEFAULT(unixepoch('now')) NOT NULL,
  updated_at INTEGER DEFAULT(unixepoch('now')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS summoner_id_idx ON riot_accounts(summoner_id);

CREATE TABLE IF NOT EXISTS riot_league_entries(
  id INTEGER PRIMARY KEY,
  summoner_id INTEGER NOT NULL,
  game TEXT CHECK(game IN ('tft')) NOT NULL,
  queue_type TEXT NOT NULL,
  tier TEXT NOT NULL,
  rank TEXT NOT NULL,
  league_points INTEGER NOT NULL,
  created_at INTEGER DEFAULT(unixepoch('now')) NOT NULL,
  updated_at INTEGER DEFAULT(unixepoch('now')) NOT NULL,
  FOREIGN KEY(summoner_id) REFERENCES riot_accounts(summoner_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS leage_entry_idx ON riot_league_entries(summoner_id, game, queue_type);
