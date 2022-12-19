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
  CircularProgress,
} from "@mui/material";
import { UserContext } from "../../context/user-context";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import "./styles.css";

export const TeamsTable = () => {
  const { user } = useContext(UserContext);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7116/api/teams", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setTeams(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
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
