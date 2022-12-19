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
import { UserContext } from "../../context/user-context";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { useContext } from "react";

export const MatchesTable = () => {
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  const getMatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7116/api/matches", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setMatches(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMatches();
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
        Rungtynės
      </Typography>
      <TableContainer
        sx={{
          maxHeight: 400,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Rungtynių Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Namų Taškai</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Svečių Taškai</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Data</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Namų Komandos Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Svečių Komandos Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Turnyro Id</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((row) => (
              <TableRow key={row.matchId}>
                <StyledTableCell sx={{ color: "white" }}>{row.matchId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.homeTeamScore}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.awayTeamScore}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  {new Date(row.matchDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.homeTeamId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.awayTeamId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.tournamentId}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
