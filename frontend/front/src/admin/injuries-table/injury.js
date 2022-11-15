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

export const InjuriesTable = () => {
  const [injuries, setInjuries] = useState([]);

  const getInjuries = async () => {
    const response = await fetch("https://localhost:7116/api/injuries");
    const data = await response.json();
    setInjuries(data);
  };

  useEffect(() => {
    getInjuries();
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
        Traumos
      </Typography>
      <TableContainer
        sx={{
          maxHeight: 400,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ color: "white" }}>Traumos Id</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Pavadinimas</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Įvykio Data</StyledTableCell>
              <StyledTableCell sx={{ color: "white" }}>Žaidėjo Id</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {injuries.map((row) => (
              <TableRow key={row.injuryId}>
                <StyledTableCell sx={{ color: "white" }}>{row.injuryId}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.name}</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  {new Date(row.injuryDate).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>{row.playerId}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
