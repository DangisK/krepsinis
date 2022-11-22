import {
  Box,
  CircularProgress,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./styles.css";

export const TeamTournamentsTable = () => {
  const [teamTournaments, setTeamTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTeamTournaments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7116/api/team-tournaments");
      const data = await response.json();
      setTeamTournaments(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTeamTournaments();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  const generateRandomKey = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  if (isLoading) {
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
        Komandų turnyrai
      </Typography>
      <TableContainer
        sx={{
          maxHeight: 400,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Komandos Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Turnyro Id</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamTournaments.map((row) => (
              <TableRow key={generateRandomKey()}>
                <StyledTableCell sx={{ color: "white" }}>{row.teamId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.tournamentId}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
