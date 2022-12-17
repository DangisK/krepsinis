import React, { useEffect, useState } from "react";
import { Typography, ButtonGroup, Button } from "@mui/material";
import "./styles.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";

export const SelectedPlayer = () => {
  const navigateTo = useNavigate();
  const { komandosId, zaidejoId } = useParams();

  const [player, setPlayer] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsTable, setIsStatsTable] = useState(true);

  useEffect(() => {
    fetchPlayer();
    fetchInjuries();
  }, []);

  const fetchPlayer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://localhost:7116/api/teams/${komandosId}/players/${zaidejoId}`
      );
      const data = await response.json();
      if (data.status === 404) {
        navigateTo(`/komandos/${komandosId}`);
        return;
      }
      setPlayer(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchInjuries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7116/api/players/${zaidejoId}/injuries`);
      const data = await response.json();
      if (data.status === 404) {
        navigateTo(`/komandos/${komandosId}`);
        return;
      }
      setInjuries(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateAveragePerGame = (stat) => {
    return String(player.totalGames === 0 ? 0 : stat / player.totalGames);
  };

  return (
    <>
      {player === null ? (
        <>
          <LinearProgress sx={{ width: "100%" }} />
        </>
      ) : (
        <>
          <div className="selected_player__header">
            <Typography variant="h2" sx={{ color: "#ffd700" }}>
              {player.name}
            </Typography>
          </div>
          <div className="selected_player">
            <div className="selected_player__details">
              <img
                src="https://img.bleacherreport.net/img/images/photos/003/702/864/1a5d4db530f5166f4528eed4481df168_crop_exact.jpg?w=798&h=531&q=75"
                alt="Selected player"
                id="thompson"
              />
              <div className="selected_player__averages">
                <div className="stats_values">
                  <ul>
                    <li>{calculateAveragePerGame(player.points)}</li>
                    <li>{calculateAveragePerGame(player.assists)}</li>
                    <li>{calculateAveragePerGame(player.rebounds)}</li>
                  </ul>
                </div>
                <div className="stats">
                  <ul>
                    <li>PPG</li>
                    <li>APG</li>
                    <li>RPG</li>
                  </ul>
                </div>
              </div>
            </div>
            <ButtonGroup variant="contained" sx={{ marginTop: "40px" }}>
              <Button onClick={() => setIsStatsTable(true)}>Stats</Button>
              <Button onClick={() => setIsStatsTable(false)}>Injuries</Button>
            </ButtonGroup>
            <div className="player__info details selected_details enlarge">
              <dl className="player__info--stats">
                {isStatsTable ? (
                  <>
                    <dt>Vardas</dt>
                    <dd>{player.name}</dd>
                    <dt>Pavardė</dt>
                    <dd>{player.surname}</dd>
                    <dt>Sužaista rungtynių</dt>
                    <dd>{player.totalGames}</dd>
                    <dt>Komanda</dt>
                    <dd>{player.teamName}</dd>
                  </>
                ) : (
                  <>
                    {injuries.length === 0 ? (
                      <Typography
                        variant="h5"
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        No injuries yet
                      </Typography>
                    ) : (
                      injuries.map((injury) => {
                        return (
                          <React.Fragment key={injury.injuryId}>
                            <dt>{injury.name}</dt>
                            <dd>{new Date(injury.injuryDate).toLocaleDateString()}</dd>
                          </React.Fragment>
                        );
                      })
                    )}
                  </>
                )}
              </dl>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// const exampleResponseObject = {
//   playerId: 1,
//   name: "team1player",
//   surname: "team1player",
//   points: 0,
//   assists: 0,
//   rebounds: 0,
//   totalGames: 0,
//   teamId: 1,
//   userId: null,
//   user: null,
// };

// const mockSelectedplayer = {
//   id: 1,
//   name: "team1player",
//   surname: "team1player",
//   teamId: 1,
// };
