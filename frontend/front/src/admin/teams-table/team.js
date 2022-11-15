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
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./styles.css";

export const TeamsTable = () => {
  const [teams, setTeams] = useState([]);

  const getTeams = async () => {
    const response = await fetch("https://localhost:7116/api/teams");
    const data = await response.json();
    setTeams(data);
  };

  useEffect(() => {
    getTeams();
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
        Komandos
      </Typography>
      <TableContainer
        sx={{
          maxHeight: 400,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Pavadinimas</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Arena</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Įsteigimo data</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((row) => (
              <TableRow key={row.id}>
                <StyledTableCell sx={{ color: "white" }}>{row.id}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.name}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.arena}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  {new Date(row.dateFounded).toLocaleDateString()}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
