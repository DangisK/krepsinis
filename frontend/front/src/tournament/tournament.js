import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Modal,
  styled,
  Typography,
  ListItemButton,
  IconButton,
  MenuItem,
  Menu,
} from "@mui/material";
import { UserContext } from "../context/user-context";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { TournamentAddModal } from "./tournament-add-modal";
import { TournamentEditModal } from "./tournament-edit-modal";

export const Tournament = () => {
  const { user } = useContext(UserContext);
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [editingTournament, setEditingTournament] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigateTo = useNavigate();

  const openMoreOptions = Boolean(anchorEl);
  const handleClick = (tournament, e) => {
    setSelectedTournament(tournament);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const onUpdate = (updatedTournament) => {
    const updatedTournaments = tournaments.map((tournament) =>
      tournament.tournamentId === updatedTournament.tournamentId ? updatedTournament : tournament
    );
    console.log(tournaments);
    setTournaments(updatedTournaments);
  };

  const onCreate = (createdTournament) => {
    const newTournaments = [...tournaments, createdTournament];
    console.log(newTournaments);
    setTournaments(newTournaments);
  };

  const closeUpdateModal = () => {
    setEditingTournament(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:7116/api/tournaments/${selectedTournament.tournamentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const filteredTournaments = tournaments.filter(
        (tournament) => tournament.tournamentId !== selectedTournament.tournamentId
      );
      setTournaments(filteredTournaments);
    } catch (e) {
      console.log(e);
    }
    setAnchorEl(null);
    setSelectedTournament(null);
  };

  const handleEdit = () => {
    setEditingTournament(selectedTournament);
    setSelectedTournament(null);
    setAnchorEl(null);
  };

  const navigateToSelectedTournament = (id) => {
    navigateTo(`/turnyrai/${id}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
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
    fetchTournaments();
  }, []);

  if (isLoading) return <LinearProgress />;

  return (
    <>
      <Typography variant="h2" mb={3}>
        Turnyrai
      </Typography>
      <StyledBox>
        <StyledList>
          {tournaments.map((tournament) => {
            const beginning = new Date(tournament.startDate).toLocaleDateString();
            const end = new Date(tournament.endDate).toLocaleDateString();
            return (
              <StyledListItem
                key={tournament.tournamentId}
                onClick={() => navigateToSelectedTournament(tournament.tournamentId)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleClick(tournament, e)}
                    sx={{ "&:hover": { bgcolor: "gray" } }}
                  >
                    <MoreVert sx={{ color: "white" }} />
                  </IconButton>
                }
              >
                <StyledItemText primary={tournament.name} secondary={`${beginning} - ${end}`} />
              </StyledListItem>
            );
          })}
        </StyledList>
      </StyledBox>
      <TournamentAddModal onCreate={onCreate} />
      {!!editingTournament && (
        <TournamentEditModal
          tournament={editingTournament}
          onUpdate={onUpdate}
          close={closeUpdateModal}
        />
      )}
      <Menu
        open={openMoreOptions}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEdit}>Keisti</MenuItem>
        <MenuItem onClick={handleDelete}>Trinti</MenuItem>
      </Menu>
    </>
  );
};

// const mockFetchData = {
//   tournamentId: 1,
//   name: "turnyas1",
//   startDate: "2022-12-11T21:39:09.237",
//   endDate: "2023-06-11T21:39:09.237",
// };

const StyledItemText = styled(ListItemText)({
  "& .MuiListItemText-primary": {
    color: "#ffd700",
  },
  "& .MuiListItemText-secondary": {
    color: "#D3D3D3",
  },
});

const StyledBox = styled(Box)({
  width: "100%",
  height: "100%",
  maxWidth: "1000px",
});

const StyledList = styled(List)({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginLeft: "12px",
});

const StyledListItem = styled(ListItem)({
  flex: "0 0 calc(50% - 12px)",
  border: "2px solid white",
  borderRadius: "10px",
  boxShadow: "3px 4px 3px 0px rgba(120, 120, 120, 0.76)",
  "&:hover": {
    transform: "scale(1.01)",
    boxShadow: "0px 0px 7px 3px rgba(230, 230, 230, 0.95)",
    cursor: "pointer",
  },
});
