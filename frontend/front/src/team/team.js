import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { TeamEditModal } from "./team-edit-modal/team-edit-modal";
import { TeamAddModal } from "./team-add-modal/team-add-modal";
import { MoreVert } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../context/user-context";

export const Team = () => {
  const { user } = useContext(UserContext);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigateTo = useNavigate();

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
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
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openMoreOptions = Boolean(anchorEl);
  const handleClick = (team, e) => {
    setSelectedTeam(team);
    setAnchorEl(e.currentTarget);
    e.stopPropagation();
  };

  const onUpdate = (updatedTeam) => {
    const updatedTeams = teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team));
    console.log(teams);
    setTeams(updatedTeams);
  };

  const onCreate = (createdTeam) => {
    const newTeams = [...teams, createdTeam];
    console.log(newTeams);
    setTeams(newTeams);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditingTeam(selectedTeam);
    setSelectedTeam(null);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://localhost:7116/api/teams/${selectedTeam.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const filteredTeams = teams.filter((team) => team.id !== selectedTeam.id);
      setTeams(filteredTeams);
    } catch (e) {
      console.log(e);
    }
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  const closeUpdateModal = () => {
    setEditingTeam(null);
  };

  const navigateToSelectedTeamsRoster = (id, teamName) => {
    navigateTo(`/komandos/${id}`);
  };

  return (
    <>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Typography variant="h2" mb={3}>
            Komandos
          </Typography>
          <StyledBox>
            <StyledList>
              {teams.map((team) => {
                const formattedDate = new Date(team.dateFounded).toLocaleDateString();
                return (
                  <StyledListItem
                    key={team.id}
                    onClick={() => navigateToSelectedTeamsRoster(team.id, team.name)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={(e) => handleClick(team, e)}
                        sx={{ "&:hover": { bgcolor: "gray" } }}
                      >
                        <MoreVert sx={{ color: "white" }} />
                      </IconButton>
                    }
                  >
                    <StyledItemText
                      primary={team.name}
                      secondary={`Arena: ${team.arena} - Founded: ${formattedDate}`}
                    />
                  </StyledListItem>
                );
              })}
            </StyledList>
          </StyledBox>
          <TeamAddModal onCreate={onCreate} />
          {!!editingTeam && (
            <TeamEditModal team={editingTeam} onUpdate={onUpdate} close={closeUpdateModal} />
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
      )}
    </>
  );
};

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

// const exampleResponseObject = {
//   id: 1,
//   name: "string",
//   arena: "string",
//   dateFounded: "2022-11-15T12:24:13.1410585",
// };
