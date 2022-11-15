import {
  TableCell,
  TableContainer,
  TableHead,
  Table,
  TableBody,
  TableRow,
  styled,
  tableCellClasses,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./styles.css";

export const PlayersTable = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamId, setTeamId] = useState(null);
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);
  const [isPlayersLoading, setIsPlayersLoading] = useState(true);

  const fetchTeams = async () => {
    setIsTeamsLoading(true);
    const response = await fetch("https://localhost:7116/api/teams");
    const data = await response.json();
    setTeams(data);
    setTeamId(data[0].id);
    setIsTeamsLoading(false);
  };

  const getPlayers = async () => {
    setIsPlayersLoading(true);
    const response = await fetch(`https://localhost:7116/api/teams/${teamId}/players`);
    const data = await response.json();
    setPlayers(data);
    setIsPlayersLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (teamId) {
      getPlayers();
    }
  }, [teamId]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  if (isTeamsLoading) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        flexDirection: "column",
        paddingTop: 5,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Žaidėjai
      </Typography>
      <Select
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        sx={{ backgroundColor: "white", width: "100%" }}
      >
        {teams.map((team) => (
          <MenuItem value={team.id} key={team.id}>
            {team.name}
          </MenuItem>
        ))}
      </Select>
      {isPlayersLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          sx={{
            maxHeight: 400,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ color: "white" }}>Id</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Vardas</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Pavardė</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Taškai</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Rezultatyvūs perdavimai</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Atkovota kamuolių</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>Sužaista</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((row) => (
                <TableRow key={row.playerId}>
                  <StyledTableCell sx={{ color: "white" }}>{row.playerId}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.name}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.surname}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.points}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.assists}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.rebounds}</StyledTableCell>
                  <StyledTableCell sx={{ color: "white" }}>{row.totalGames}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
