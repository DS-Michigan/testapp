import teamsData from '../data/teams.json';
import matchesData from '../data/matches.json';

export interface Team {
  id: string;
  name: string;
  players: string[];
}

export interface Standing {
  team: Team;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  matchesPlayed: number;
}

export interface H2HRecord {
  opponent: Team;
  wins: number;
  losses: number;
  ties: number;
  points: number;
}

function getTeam(id: string): Team | undefined {
  const all = [...teamsData.north, ...teamsData.south];
  return all.find(t => t.id === id);
}

export function computeStandings(flight: 'north' | 'south'): Standing[] {
  const teams = teamsData[flight];
  const standings: Record<string, Standing> = {};

  for (const team of teams) {
    standings[team.id] = { team, wins: 0, losses: 0, ties: 0, points: 0, matchesPlayed: 0 };
  }

  for (const week of matchesData) {
    if (week.flight !== flight) continue;
    for (const match of week.matches) {
      const home = standings[match.home];
      const away = standings[match.away];
      if (!home || !away) continue;

      home.matchesPlayed++;
      away.matchesPlayed++;

      if (match.result === 'home') {
        home.wins++; home.points += 1;
        away.losses++;
      } else if (match.result === 'away') {
        away.wins++; away.points += 1;
        home.losses++;
      } else {
        home.ties++; home.points += 0.5;
        away.ties++; away.points += 0.5;
      }
    }
  }

  return Object.values(standings).sort((a, b) => b.points - a.points || b.wins - a.wins);
}

export function computeH2H(teamId: string): H2HRecord[] {
  const records: Record<string, H2HRecord> = {};

  for (const week of matchesData) {
    for (const match of week.matches) {
      let myResult: 'win' | 'loss' | 'tie' | null = null;
      let opponentId: string | null = null;

      if (match.home === teamId) {
        opponentId = match.away;
        myResult = match.result === 'home' ? 'win' : match.result === 'tie' ? 'tie' : 'loss';
      } else if (match.away === teamId) {
        opponentId = match.home;
        myResult = match.result === 'away' ? 'win' : match.result === 'tie' ? 'tie' : 'loss';
      }

      if (!opponentId || !myResult) continue;

      if (!records[opponentId]) {
        const opp = getTeam(opponentId);
        if (!opp) continue;
        records[opponentId] = { opponent: opp, wins: 0, losses: 0, ties: 0, points: 0 };
      }

      if (myResult === 'win') { records[opponentId].wins++; records[opponentId].points += 1; }
      else if (myResult === 'loss') { records[opponentId].losses++; }
      else { records[opponentId].ties++; records[opponentId].points += 0.5; }
    }
  }

  return Object.values(records).sort((a, b) => b.points - a.points);
}

export function getAllTeams() {
  return { north: teamsData.north as Team[], south: teamsData.south as Team[] };
}
