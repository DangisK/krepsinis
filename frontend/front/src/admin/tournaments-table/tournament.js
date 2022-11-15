import {
  Box,
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

export const TournamentsTable = () => {
  const [tournaments, setTournaments] = useState([]);

  const getTournaments = async () => {
    const response = await fetch("https://localhost:7116/api/tournaments");
    const data = await response.json();
    setTournaments(data);
  };

  useEffect(() => {
    getTournaments();
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
        Turnyrai
      </Typography>
      <TableContainer
        sx={{
          maxHeight: 400,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Turnyro Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Pavadinimas</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Pradžia</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Pabaiga</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments.map((row) => (
              <TableRow key={row.tournamentId}>
                <StyledTableCell sx={{ color: "white" }}>{row.tournamentId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.name}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  {new Date(row.startDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  {new Date(row.endDate).toLocaleDateString()}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
