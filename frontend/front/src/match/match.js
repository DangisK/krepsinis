import { Delete, Edit } from "@mui/icons-material";
import { LinearProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MatchAddModal } from "./match-add-modal";
import { MatchEditModal } from "./match-edit-modal";
import "./styles.css";

export const Match = () => {
  const { turnyroId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const navigateTo = useNavigate();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchTournament();
  }, []);

  const onCreate = (createdMatch) => {
    const newMatches = [...matches, createdMatch];
    console.log(newMatches);
    setMatches(newMatches);
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
  };

  const handleDelete = async (selectedMatch) => {
    try {
      const response = await fetch(
        `https://localhost:7116/api/tournaments/${turnyroId}/matches/${selectedMatch.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(""),
        }
      );
      const filteredMatches = matches.filter((match) => match.id !== selectedMatch.id);
      setMatches(filteredMatches);
    } catch (e) {
      console.log(e);
    }
  };

  const onUpdate = (updatedMatch) => {
    const updatedMatches = matches.map((match) =>
      match.id === updatedMatch.id ? updatedMatch : match
    );
    setMatches(updatedMatches);
  };

  const closeUpdateModal = () => {
    setEditingMatch(null);
  };

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7116/api/tournaments/${turnyroId}/matches`);
      const data = await response.json();
      if (data.status === 404) {
        navigateTo("/tournaments");
        return;
      }
      setMatches(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7116/api/teams`);
      const data = await response.json();
      if (data.status === 404) {
        navigateTo("/tournaments");
        return;
      }
      setTeams(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTournament = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://localhost:7116/api/tournaments/${turnyroId}`);
      const data = await response.json();
      console.log(data);
      if (data.status === 404) {
        navigateTo("/tournaments");
        return;
      }
      setTournament(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {isLoading || tournament === null ? (
        <LinearProgress sx={{ width: "100%" }} />
      ) : (
        <>
          <div className="schedule">
            <div className="content__header">
              <Typography variant="h2">Rungtynės</Typography>
            </div>
            <div className="table_container">
              <table className="standings">
                <thead className="standings__header">
                  <tr className="standings__header_row">
                    <th className="header_row__item">Namai</th>
                    <th className="header_row__item">Rezultatas</th>
                    <th className="header_row__item">Svečiai</th>
                    <th className="header_row__item">Vieta</th>
                    <th className="header_row__item">Data</th>
                    <th className="header_row__item">Veiksmai</th>
                  </tr>
                </thead>
                <tbody className="standings__body">
                  {matches.map((match) => {
                    return (
                      <tr key={match.id}>
                        <td className="body_data__item">{match.homeTeamName}</td>
                        <td className="body_data__item">{`${match.homeTeamScore} : ${match.awayTeamScore}`}</td>
                        <td className="body_data__item">{match.awayTeamName}</td>
                        <td className="body_data__item">{match.arena}</td>
                        <td className="body_data__item">
                          {new Date(match.matchDate).toLocaleDateString("zh-Hans-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="body_data__item">
                          <div className="icons">
                            <Edit
                              onClick={() => handleEdit(match)}
                              sx={{ "&:hover": { bgcolor: "gray" } }}
                            />
                            <Delete
                              onClick={() => handleDelete(match)}
                              sx={{ "&:hover": { bgcolor: "gray" } }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <MatchAddModal onCreate={onCreate} />
              {!!editingMatch && (
                <MatchEditModal
                  match={editingMatch}
                  onUpdate={onUpdate}
                  close={closeUpdateModal}
                  teams={teams}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// const mockFetchData = {
//   "id": 2,
//   "homeTeamScore": 50,
//   "awayTeamScore": 55,
//   "tournamentId": 1,
//   "matchDate": "2022-12-11T21:49:10.8184076",
//   "homeTeamId": 1,
//   "awayTeamId": 3,
//   "homeTeamName": "string",
//   "awayTeamName": "string5"
// },
