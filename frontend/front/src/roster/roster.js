import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";
import { Player } from "../player";
import { IconButton, LinearProgress, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { PlayerAddModal } from "./player-add-modal";
import { PlayerEditModal } from "../selected-player/player-edit-modal";
import { MoreVert } from "@mui/icons-material";
import { apiImages } from "../images/api-images";
import { useContext } from "react";
import { UserContext } from "../context/user-context";

export const Roster = () => {
  const { user } = useContext(UserContext);
  const { komandosId } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    // setImages(apiImages);
    // fetchImages();
    fetchPlayers();
    fetchTeam();
  }, []);

  const onUpdate = (updatedPlayer) => {
    const updatedPlayers = players.map((player) =>
      player.id === updatedPlayer.id ? updatedPlayer : player
    );
    console.log(players);
    setPlayers(updatedPlayers);
  };

  const onCreate = (createdPlayer) => {
    const newPlayers = [...players, createdPlayer];
    console.log(newPlayers);
    setPlayers(newPlayers);
  };

  const fetchImages = async () => {
    setIsFetching(true);
    const response = await fetch(
      "https://api.unsplash.com/search/photos?query=basketball&client_id=dE2uZwZjrsYoLBH1GDqaNNd5ku4W7KJo4VyNTX4OROY"
    );
    const data = await response.json();
    console.log(data.results);
    const photos = data.results.map((img) => ({ src: img.urls.small, alt: img.alt_description }));
    setImages(photos);
    setIsFetching(false);
  };

  const fetchPlayers = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`https://localhost:7116/api/teams/${komandosId}/players`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (data.status === 404) {
        navigateTo("/komandos");
        return;
      }
      setPlayers(data);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTeam = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`https://localhost:7116/api/teams/${komandosId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.status === 404) {
        navigateTo("/komandos");
        return;
      }
      setTeam(data);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (isFetching || team === null) return <LinearProgress sx={{ width: "100%" }} />;

  console.log(players);

  return (
    <>
      <div className="content__header">
        <Typography variant="h2">{team.name} komandos sudėtis</Typography>
      </div>
      <div className="team">
        {players.map((player) => {
          return (
            <Player
              playerInfo={player}
              src={apiImages[player.id % 10]["src"]}
              alt={apiImages[player.id % 10]["alt"]}
              key={player.id}
              teamId={komandosId}
              teamName={team.name}
            />
          );
        })}
      </div>
      <PlayerAddModal onCreate={onCreate} teamId={komandosId} />
    </>
  );
};

// const exampleResponseObject = {
//   playerId: 1,
//   name: "team1player",
//   surname: "team1player",
//   points: 0,
//   assists: 0,
//   rebounds: 0,
//   totalGames: 0,
//   teamId: 1,
//   userId: null,
//   user: null,
// };
