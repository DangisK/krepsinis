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
import { useContext } from "react";
import "./styles.css";

export const TournamentsTable = () => {
  const { user } = useContext(UserContext);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTournaments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7116/api/tournaments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setTournaments(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
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
