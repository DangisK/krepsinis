export const findTeamValueForSelect = (type, teams, match) => {
  switch (type) {
    case "home":
      return teams.findIndex((team) => team.name === match.homeTeamName) + 1;
      break;
    case "away":
      return teams.findIndex((team) => team.name === match.awayTeamName) + 1;
      break;
  }
  console.log("never");
  return teams.findIndex((team) => team.name === match.homeTeamName) + 1;
};
