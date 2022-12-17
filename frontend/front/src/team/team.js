import { Box, List, ListItem, ListItemText, Paper, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import "./styles.css";
import { useNavigate } from "react-router-dom";

export const Team = () => {
  const navigateTo = useNavigate();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://localhost:7116/api/teams");
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
