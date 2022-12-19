import React, { useEffect, useState } from "react";
import {
  Typography,
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  tableCellClasses,
} from "@mui/material";
import "./styles.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { PlayerEditModal } from "./player-edit-modal";
import { Add, Delete, Edit } from "@mui/icons-material";
import { apiImages } from "../images/api-images";
import { InjuryAddModal } from "./injury-add-modal";
import { InjuryEditModal } from "./injury-edit-modal";
import { useContext } from "react";
import { UserContext } from "../context/user-context";

export const SelectedPlayer = () => {
  const { user } = useContext(UserContext);
  const { komandosId, zaidejoId } = useParams();
  const [player, setPlayer] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsTable, setIsStatsTable] = useState(false);
  const [addingInjury, setAddingInjury] = useState(false);
  const [editingInjury, setEditingInjury] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [alignment, setAlignment] = useState("traumos");
  const navigateTo = useNavigate();

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    fetchPlayer();
    fetchInjuries();
  }, []);

  const onCreate = (createdInjury) => {
    const newInjuries = [...injuries, createdInjury];
    setInjuries(newInjuries);
  };

  const fetchPlayer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://localhost:7116/api/teams/${komandosId}/players/${zaidejoId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
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
      const response = await fetch(`https://localhost:7116/api/players/${zaidejoId}/injuries`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
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

  const closeAddModal = () => {
    setAddingInjury(false);
  };

  const onPlayerUpdate = (updatedPlayer) => {
    setPlayer(updatedPlayer);
  };

  const closePlayerUpdateModal = () => {
    setEditingPlayer(null);
  };

  const onInjuryUpdate = (updatedInjury) => {
    const updatedInjuries = injuries.map((injury) =>
      injury.id === updatedInjury.id ? updatedInjury : injury
    );
    setInjuries(updatedInjuries);
  };

  const closeInjuryUpdateModal = () => {
    setEditingInjury(null);
  };

  const handlePlayerDelete = async (deletedPlayer) => {
    try {
      const response = await fetch(
        `https://localhost:7116/api/teams/${komandosId}/players/${zaidejoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      navigateTo(`/komandos/${komandosId}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInjuryDelete = async (deletedInjury) => {
    try {
      const response = await fetch(
        `https://localhost:7116/api/players/${zaidejoId}/injuries/${deletedInjury.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const filteredInjuries = injuries.filter((injury) => injury.id !== deletedInjury.id);
      setInjuries(filteredInjuries);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePlayerEdit = () => {
    setEditingPlayer(player);
  };

  const handleInjuryEdit = (injury) => {
    setEditingInjury(injury);
  };

  const handleAdd = () => {
    setAddingInjury(true);
  };

  const calculateAveragePerGame = (stat) => {
    return String(parseFloat(player.totalGames === 0 ? 0 : stat / player.totalGames).toFixed(2));
  };

  if (player === null) return <LinearProgress sx={{ width: "100%" }} />;

  return (
    <div className="selected_player_container">
      <div className="selected_player__header">
        <Typography
          variant="h2"
          sx={{
            color: "#ffd700",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "522.75px",
          }}
        >
          <div></div>
          {player.name}
          <div className="actions">
            <Edit
              onClick={() => {
                handlePlayerEdit();
              }}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "gray" },
                width: "35px",
                height: "35px",
              }}
            />
            <Delete
              onClick={() => handlePlayerDelete(player)}
              sx={{ color: "white", "&:hover": { bgcolor: "gray" }, width: "35px", height: "35px" }}
            />
          </div>
        </Typography>
      </div>
      <div className="selected_player">
        <div className="selected_player__details">
          <img src={apiImages[player.id % 10]["src"]} alt={apiImages[player.id % 10]["alt"]} />
          <Typography variant="h5" sx={{ marginTop: "20px" }}>
            Averages
          </Typography>
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
                <li>Points per game</li>
                <li>Assists per game</li>
                <li>Rebounds per game</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="additional_player_info">
          <ToggleButtonGroup
            color="success"
            value={alignment}
            exclusive
            onChange={handleChange}
            sx={{ marginTop: "40px", gap: "5px", color: "white" }}
          >
            <StyledToggleButton
              value="traumos"
              sx={{ width: "100px" }}
              onClick={() => setIsStatsTable(false)}
            >
              Traumos
            </StyledToggleButton>
            <StyledToggleButton
              value="statistika"
              sx={{ width: "100px" }}
              onClick={() => setIsStatsTable(true)}
            >
              Statistika
            </StyledToggleButton>
          </ToggleButtonGroup>
          {isStatsTable && (
            <div className="player__info details selected_details">
              <dl className="player__info--stats">
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
              </dl>
            </div>
          )}
          {!isStatsTable && (
            <>
              <TableContainer component={Paper} sx={{ maxWidth: "510.52px", marginTop: "30px" }}>
                <Table sx={{ minWidth: "400px" }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Trauma</StyledTableCell>
                      <StyledTableCell align="right">Data</StyledTableCell>
                      <StyledTableCell align="right">
                        <div className="injury_actions">
                          Veiksmai
                          <Add
                            onClick={() => {
                              handleAdd();
                            }}
                            sx={{
                              "&:hover": { bgcolor: "gray" },
                            }}
                          />
                        </div>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {injuries.length !== 0 &&
                      injuries.map((injury) => (
                        <StyledTableRow key={injury.id}>
                          <StyledTableCell component="th" scope="row">
                            {injury.name}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {new Date(injury.injuryDate).toLocaleDateString()}
                          </StyledTableCell>
                          <StyledTableCell
                            align="right"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Delete
                              onClick={() => handleInjuryDelete(injury)}
                              sx={{
                                color: "black",
                                "&:hover": { bgcolor: "gray" },
                              }}
                            />
                            <Edit
                              onClick={() => {
                                handleInjuryEdit(injury);
                              }}
                              sx={{
                                color: "black",
                                "&:hover": { bgcolor: "gray" },
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {addingInjury && (
                <InjuryAddModal onCreate={onCreate} close={closeAddModal} player={player} />
              )}
              {!!editingInjury && (
                <InjuryEditModal
                  player={player}
                  onUpdate={onInjuryUpdate}
                  close={closeInjuryUpdateModal}
                  injury={editingInjury}
                />
              )}
            </>
          )}
        </div>
      </div>
      {!!editingPlayer && (
        <PlayerEditModal
          player={editingPlayer}
          onUpdate={onPlayerUpdate}
          close={closePlayerUpdateModal}
          teamId={komandosId}
        />
      )}
    </div>
  );
};

const StyledToggleButton = styled(ToggleButton)({
  color: "white",
  backgroundColor: "rgba(46, 125, 50, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(46, 125, 50, 0.4)",
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: "rgba(46, 125, 50, 0.7)",
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
