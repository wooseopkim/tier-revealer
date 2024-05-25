export default interface Identity {
  gameName: string;
  leagueEntries: {
    queueType: string;
    tier: string;
    rank: string;
  }[];
}
