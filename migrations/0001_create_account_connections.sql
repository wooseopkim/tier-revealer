-- Migration number: 0001 	 2024-05-25T06:55:59.847Z

CREATE TABLE IF NOT EXISTS account_connections(
    id INTEGER PRIMARY KEY,
    riot_sub TEXT NOT NULL,
    connection_type TEXT CHECK(connection_type IN ('dcinside')) NOT NULL,
    connection_data TEXT NOT NULL,
    created_at INTEGER DEFAULT(unixepoch('now')) NOT NULL,
    updated_at INTEGER DEFAULT(unixepoch('now')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS account_connection_idx ON account_connections(riot_sub, connection_type);
