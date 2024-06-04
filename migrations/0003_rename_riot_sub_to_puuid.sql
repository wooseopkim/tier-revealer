-- Migration number: 0003 	 2024-06-04T13:40:48.569Z

ALTER TABLE account_connections RENAME COLUMN riot_sub TO puuid;
